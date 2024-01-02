const bcrypt = require("bcrypt")
const File = require("../models/File")

async function uploadFile(req, res) {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  }

  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10)
  }
  
  const file = await File.create(fileData)

  return res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
}

module.exports = uploadFile
