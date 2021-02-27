const fs = require("fs");
const multer = require('multer');
const cors = require('cors');
const axios = require("axios");
const express = require('express');
const app = express();
const port = 5000; // default React server is 3000, don't clash with it
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors())


//import { createRequire } from 'module';
//import { jsPDF } from "jspdf";
const jsPDF = require("jspdf")
//const require = createRequire(import.meta.url);
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
var glob = require("glob");
const { reset } = require("nodemon");


class Rect {
    constructor(width, height, imagePath) {
        this.height = height;
        this.width = width;
        this.bot_left = null;
        this.top_right = null;
        this.imagePath= imagePath;
    }

    set_top_right_coord(x, y) {
        this.top_right = [x, y]
        this.bot_left = [x - this.width, y - this.height]
        this.top_left = [x - this.width, y]
    }

    toString() {
        return `height: ${this.height} width: ${this.width} bottom_left: ${this.bot_left} top_right: ${this.top_right} top_left: ${this.top_right}`
    }
}

function fit_rectangles(rectangles, paper) {
    // sort base on height
    rectangles.sort(function (a, b) { return b.height - a.height });
    // first bin 
    temp_rects = rectangles
    temp_bin = paper
    current_bin_level = 0
    while (temp_rects.length != 0) {

        next_bin_height = temp_bin.height - temp_rects[0].height
        if (next_bin_height >= 0) {
            height_of_bin = temp_rects[0].height
            //returns array of rect that cannot be fit
            temp_rects = create_bin(temp_rects, temp_bin, current_bin_level)
            // create a new bin for the next level
            temp_bin = new Rect(temp_bin.width, next_bin_height);
            //increment current bin level by height of bin created
            current_bin_level += height_of_bin
        } else {
            rectangles = [];
            break;
        }
    }
    return rectangles
}

// fit rectangles into bin and set their coord, returns remaining rectangles that cannot be fit, current_bin_level refers to the level of the bin
// note rectangles are arranged in deceasing height
function create_bin(rectangles, bin, current_bin_level) {
    remaining_rec = []
    bin_height = rectangles[0].height
    bin_width = bin.width
    //current_coord represents the previous rect top_right
    current_coord = [0, 0]
    for (i = 0; i < rectangles.length; i++) {
        rect = rectangles[i]
        temp_coord = [current_coord[0] + rect.width, rect.height]

        if (temp_coord[0] <= bin_width && temp_coord[1] <= bin_height) {
            // if temp_coord[0] == bin_width, break, then add remaining rect to the arr that cant be fitted
            rect.set_top_right_coord(temp_coord[0], temp_coord[1] + current_bin_level)

            current_coord = temp_coord
        } else {
            // rectangle cannot be fitted into bin
            remaining_rec.push(rect)
        }
    }
    return remaining_rec
}

function merge_images(rectangles) {

    // Default export is a4 paper, portrait, using millimeters for units
    // Landscape export, 2×4 inches
    //2480, 3508
    //1240, 2750]
    const doc = new jsPDF.jsPDF('p', 'px', [1400, 3508]);// ake sure the 2 width and height are the same

    var images = []
    // for (i = 0; i < rectangles.length; i++) {
    //     images.push({src: './public/'})
    //     rectangles[i].bot_left
    // }
    //Hardcoded so far
    console.log("Reached merged image!")
    console.log(rectangles)
    for (i = 0; i < rectangles.length; i++) {
        images.push({ src: rectangles[i].imagePath, x: rectangles[i].bot_left[0], y: rectangles[i].bot_left[1] })
    }
    console.log(images)

    

    mergeImages(images, {
        Canvas: Canvas,
        Image: Image,
        width: 2680, //A4 size
        height: 3508
    }).then(b64 => doc.addImage(b64, "PNG", 0, 0)).then(b64 => doc.save("./pdfs/user1.pdf"));

    console.log("FINISHED!")
}


app.get('/', function (req, res) {
    return res.send("Local Server OK")
})

app.post("/get_image_information", async function(req, res) {
    console.log("image_inforation!!")
    file_paths = req.body
    image_data = []
    for (let i = 0; i < file_paths.length; i++) {
        data  = {"image_path": "../backend/"+file_paths[i], "image_name":i}
        const image = await axios.post('http://127.0.0.1:1080/predict', data)
            .then(res => {
                image_data.push(res.data)
            }).catch((err)=> {
                console.log(err)
            })
    }
    console.log(image_data)
    return res.status(200).send(image_data)

})

app.post("/get_final_coordinates", async function(req, res){
    const paper = new Rect(2480, 3508)
    //const paper = new Rect(800, 1000)
    var rectangles = []
    var scores = []
    image_details = req.body;

    //console.log(image_details)

    for (let i = 0; i < image_details.length; i++) {
        scores.push(image_details[i]["prediction"][2])
    }
      
    scores = scores.filter(element => ![0].includes(element));
    if (scores.length == 0) {
        min_score = 0
    } else {

        min_score = Math.max(30, Math.min(...scores))
        
    }

    arr = []
    var counter = 0
    while (arr.length == 0) {

        if (counter == 3){
            break;
        }

        for (let i = 0; i < image_details.length; i++) {
              //do something with e.g. req.body[key]
              score = image_details[i]["prediction"][2]

              if (min_score == 0) {
                  score_multiplier = 1
              } else if (score == 0) { 
                score_multiplier = 1
              }
                else {
                score_multiplier = (min_score/score)
              }

              
              new_width = score_multiplier*image_details[i]["prediction"][0]
              new_height = score_multiplier*image_details[i]["prediction"][1]
              rect = new Rect(new_width, new_height,image_details[i]["image_path"])
              image_details[i]["prediction"][0] = new_width
              image_details[i]["prediction"][1] = new_height
              image_details[i]["prediction"][2] = min_score
              rectangles.push(rect)
          }

        arr = fit_rectangles(rectangles, paper)
        //console.log("image_details")
        //console.log(image_details)

        if (arr.length == 0) {
            rectangles = []
            for (let i = 0; i < image_details.length; i++) {
                  //do something with e.g. req.body[key]
                  image_details[i]["prediction"][0] = image_details[i]["prediction"][0] * 0.90
                  image_details[i]["prediction"][1] = image_details[i]["prediction"][1] * 0.90
                
              }

        }
        counter += 1
    }
    console.log("Finding here")
    console.log(rectangles)
    for (let i = 0; i < rectangles.length; i++){
        // console.log("immage path!")
        // console.log(rectangles[i].imagePath)
        // console.log(rectangles[i].imagePath + "_resized")

        // console.log("image path 2!!!")
        const old_path = rectangles[i].imagePath
        const new_image_path = old_path.slice(0, old_path.length-4) + "_resized" + old_path.slice(old_path.length-4,old_path.length)
        console.log("BUTTERLY")
        console.log(rectangles[i].height)
        console.log(typeof(rectangles[i].height))
        const data = {'image_path': rectangles[i].imagePath, 'new_path': new_image_path , "new_width": rectangles[i].width, "new_height": rectangles[i].height}
        console.log(data)
        const new_file_path = await axios.post("http://127.0.0.1:1080/resize", data)
                                    .then(res => {
                                        console.log("HELLO!!!")
                                        console.log(res.data)
                                        rectangles[i].imagePath = res.data.resized_image
                                        console.log(rectangles[i])
                                    }).catch((err)=> {
                                        console.log(err)
                                    })
    }
    // console.log("IN BETWEEN")
    console.log(rectangles)

    merge_images(arr);
})

app.post('/upload/:user_id', function (req, res) {
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public')
        },
        filename: function (req, file, cb) {
            cb(null, req.params.user_id + '_' + file.originalname)
        }
    });
    var upload = multer({ storage: storage }).array('file');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});

app.get("/get_file_names/:user_id", (req, res) => {
    var file_list = glob(`public/${req.params.user_id}_*.+(jpg|png)`, options = { nocase: true }
        , function (err, files) {
            if (err) {
                console.log(err)
            } else {
                res.send(files)
            }
        })
});

app.get("/results", (req, res) => {
    var file = fs.createReadStream("./pdfs/e-final-coverpage.pdf");
    file.pipe(res);
});


app.set("view engine", "ejs");
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});