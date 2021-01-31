const express = require('express')
const app = express()
const db = require('./db')
const multer = require('multer')
const uidSafe = require('uid-safe')
const path = require('path')
const s3 = require('./s3')

const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + '/uploads')
  },
  filename: function (req, file, callback) {
    uidSafe(24).then(function (uid) {
      callback(null, uid + path.extname(file.originalname))
    })
  },
})

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152,
  },
})

app.use(express.static('public'))
app.use(express.json())

app.get('/image', (req, res) => {
  db.getImages()
    .then((results) => {
      res.json(results.rows)
      // console.log("rows:", results.rows);
    })
    .catch((err) => {
      console.log('Error in getImages: ', err)
      res.send('error')
    })
})
// uploader is middleware in charge to handle the coming file and allowed it to upload
app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
  // multer
  console.log('input value:', req.body)
  const imageUrl = `https://s3.amazonaws.com/spicedling/${req.file.filename}`
  // imageUrl = url;

  const { title, description, username } = req.body
  // ("https://s3.amazonaws.com/spicedling/");
  // console.log("url:", imageUrl);
  // console.log(title, description, username, imageUrl);
  // console.log("files:", req.file);
  if (req.file) {
    db.imagesInfo(title, description, username, imageUrl)
      .then(({ rows }) => {
        // console.log("results:", results.rows[0]);
        rows = rows[0]
        res.json({ rows })
      })
      .catch((err) => {
        console.log('Error on imagesInfo', err)
      })
  } else {
    res.json({
      success: false,
    })
  }
})
app.get('/image/:id', (req, res) => {
  const { id } = req.params
  // const { image } = req.file;
  // console.log("imageId:", imageId);
  db.getSingleImage(id)
    .then((results) => {
      // console.log("SingleImage:", results);
      res.json(results.rows[0])
      // console.log("ImagesId results:", results.rows[0]);
    })
    .catch((err) => {
      console.log('error in ImagesId:', err)
    })
})

app.get('/comments/:id', (req, res) => {
  const { id } = req.params
  // const { image } = req.file;
  console.log('imageId:', id)
  db.getCommentId(id)

    .then(({ rows }) => {
      // console.log("getCommentId:", results);
      console.log('getCommentId  results:', rows)
      res.json(rows)
    })
    .catch((err) => {
      console.log('error in getCommentId:', err)
    })
})

app.post('/comment', (req, res) => {
  console.log('request body: ', req.body)
  const { username, comment, id } = req.body
  db.addComments(username, comment, id)
    .then(({ rows }) => {
      rows = rows[0]
      console.log('rows: ', rows)
      res.json({ rows })
    })
    .catch((err) => {
      console.log('Error in getComments: ', err)
      res.sendStatus(500)
    })
})

app.get('/images/:id', (req, res) => {
  const { id } = req.params
  db.getMoreImages(id)
    .then(({ rows }) => {
      res.json(rows)
    })
    .catch((err) => {
      console.log('Error in getMoreImages:', err)
    })
})

app.listen(8080, () => console.log('Server is running...'))
