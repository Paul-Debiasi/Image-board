const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

app.use(express.static("public"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((results) => {
            res.json(results.rows);
            console.log("rows:", results.rows);
        })
        .catch((err) => {
            console.log("Error in getImages: ", err);
            res.send("error");
        });
});
// uploader is middleware in charge to handle the coming file and allowed it to upload
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // multer
    console.log("input value:", req.body);
    const imageUrl = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
    // imageUrl = url;

    const { title, description, username } = req.body;
    // ("https://s3.amazonaws.com/spicedling/");
    console.log("url:", imageUrl);
    console.log(title, description, username, imageUrl);
    console.log("files:", req.file);
    if (req.file) {
        db.imagesInfo(title, description, username, imageUrl)
            .then((results) => {
                console.log("results:", results.rows[0]);
                res.json({
                    success: true,
                    image: results.rows[0],
                });
            })
            .catch((err) => {
                console.log("Error on imagesInfo", err);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => console.log("Server is running..."));
