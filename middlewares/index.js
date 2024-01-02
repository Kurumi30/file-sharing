const bcrypt = require("bcrypt")
const File = require("../models/File")
const { readdir, unlink, stat } = require("fs/promises")

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id)

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password")

      return
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true })

      return
    }
  }

  file.downloadCount++
  await file.save()

  return res.download(file.path, file.originalName)
}

async function deleteFiles(req, res, next) {
  try {
    const folder = "./uploads/"
    const files = await readdir(folder)

    for (const file of files) {
      const filePath = `${folder}${file}`

      if (file.includes(".gitkeep")) continue

      const { ctime } = await stat(filePath)
      const modifiedTime = new Date(ctime).getTime()
      const now = Date.now()
      const diff = (now - modifiedTime) / 1000
      const deleteTime = process.env.TIME || 6000

      if (diff > deleteTime) {
        await unlink(filePath)
        
        console.info(`🗑 Deleted ${filePath}`)
      }
    }
  } catch (err) {
    console.error(err)
  }

  if (next) {
    next()
  }
}

module.exports = { handleDownload, deleteFiles }
