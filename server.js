const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const { handleDownload, deleteFiles } = require("./middlewares")
const uploadFile = require("./controllers/upload")

const app = express()
const port = process.env.PORT || 3000
const upload = multer({ dest: "uploads" })

mongoose.connect(process.env.DATABASE_URL)

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))

app.get("/", deleteFiles, (req, res) => {
  res.render("index")
})

app.post("/upload", deleteFiles, upload.single("file"), uploadFile)

app.route("/file/:id").get(handleDownload).post(handleDownload)

app.listen(port, () => console.log(`http://localhost:${port}`))
