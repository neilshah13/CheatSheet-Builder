const multer = require('multer');
const cors = require('cors');
const express = require('express');
const fs = require("fs");

const app = express();
const port = 5000; // default React server is 3000, don't clash with it


app.use(cors());

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

app.get("/results", (req, res) => {
    var file = fs.createReadStream("./pdfs/e-final-coverpage.pdf");
    file.pipe(res);
});


app.set("view engine", "ejs");

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});