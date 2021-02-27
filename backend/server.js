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
var glob = require("glob")


class Rect {
    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.bot_left = null;
        this.top_right = null;
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
    const doc = new jsPDF.jsPDF('p', 'pt', [2480, 3508]);// ake sure the 2 width and height are the same

    var images = []
    // for (i = 0; i < rectangles.length; i++) {
    //     images.push({src: './public/'})
    //     rectangles[i].bot_left
    // }
    console.log(rectangles)
    //Hardcoded so far
    for (i = 0; i < rectangles.length; i++) {
        if (i == 0) {
            images.push({ src: './public/test1.jpg', x: rectangles[i].bot_left[0], y: rectangles[i].bot_left[1] })

        } else if (i == 1) {
            images.push({ src: './public/test2.jpg', x: rectangles[i].bot_left[0], y: rectangles[i].bot_left[1] })
        } else if (i == 2) {
            images.push({ src: './public/test3.jpg', x: rectangles[i].bot_left[0], y: rectangles[i].bot_left[1] })
        }
    }
    console.log(images)

    // var images = [
    //     {src: './public/test1.jpg', x:0, y:0},
    //     {src:'./public/test2.jpg', x:787, y:0}, 
    //     {src: './public/test3.jpg', x:1425, y:0},
    // ]

    mergeImages(images, {
        Canvas: Canvas,
        Image: Image,
        width: 2480, //A4 size
        height: 3508
    }).then(b64 => doc.addImage(b64, "PNG", 0, 0)).then(b64 => doc.save("./Merged_Images/user1.pdf"));

    console.log("FINISHED!")
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
var upload = multer({ storage: storage }).array('file')

app.get('/', function (req, res) {
    return res.send("Local Server OK")
})

app.post("/get_final_coordinates", function (req, res) {
    const paper = new Rect(2480, 3508)
    var rectangles = []
    image_details = req.body;
    for (var key in image_details) {
        if (req.body.hasOwnProperty(key)) {
            //do something with e.g. req.body[key]
            console.log(image_details[key])
            rectangles.push(new Rect(image_details[key][0], image_details[key][1]))
        }
    }
    arr = fit_rectangles(rectangles, paper)
    //   var files = glob("./public/*.png")
    //   console.log(files)
    merge_images(arr);
})

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })
});

<<<<<<< HEAD
app.get('/results', function (req, res) {

    // defined file is for debugging
    var filePath = "./pdfs/e-final-coverpage.pdf"
    //
    // let resultPDF = fs.readFileSync(filePath);
    // res.contentType("application/pdf");
    // res.send(resultPDF)


    var resultPDF = fs.readFile(filePath,
        function (err, data) {
            res.contentType("application/pdf");
            res.status(200).send(data);
        });
});

// images files 
=======
app.get("/results", (req, res) => {
    var file = fs.createReadStream("./pdfs/e-final-coverpage.pdf");
    file.pipe(res);
});


app.set("view engine", "ejs");
>>>>>>> d656f879188fb71113a5a02611133a90dec98204

app.set("view engine", "ejs");
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});