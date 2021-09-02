const config = require("../config");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt');
const { Dropbox } = require('dropbox');
prompt.start();
let modulo = {};

const params = multer().single();

const storageFilesIns = multer.diskStorage({
    destination: `${config.settings.folders.archivos}`,
    filename: function (req, file, callback) {
        let extencion = path.extname(file.originalname);
        let extenciones = config.settings.imageTypes;
        if (extenciones.includes(extencion.slice(1))) {
            let filename = "";
            filename = Date.now() + extencion;
            callback(null, filename);
        } else {
            callback({
                title: "Error de validación",
                message: `Extension ${extencion}, no esta permitida`,
                error: 1,
                field: file.fieldname
            }, null);
        }
    }
});

const upload = multer({
    storage: storageFilesIns
}).single("image");

modulo.home = async (req, res, next) => {
    const dbx = new Dropbox({ accessToken: config.settings.DROPBOX_TOKEN });
    //https://www.dropbox.com/s/7pojyjpjvfxjfo3/1630612906325.png?dl=0
    dbx.filesListFolder({
        path: '' })
        .then((response) => {
            console.log(response.result.entries);
            res.render("index", { files: response.result.entries});
        })
        .catch((err) => {
            console.log(err);
        });
}

modulo.create = async (req, res, next) => {
    upload(req, res, async (err) => {
        const dbx = new Dropbox({ accessToken: config.settings.DROPBOX_TOKEN });
        if (!err) {
            let file = path.resolve(path.join(config.settings.folders.archivos, req.file.filename));
            fs.readFile(file, (err, contents) => {
                dbx.filesUpload({ path: `/${req.file.filename}`, contents })
                    .then((response) => {
                        res.status(200).json({error:0, message:"OK"});
                    })
                    .catch((uploadErr) => {
                        res.status(200).json(uploadErr);
                    });

            });
        } else {
            res.status(200).json(err);
        }
    });
}
modulo.download = async (req, res, next) => {
    params(req, res, async (err) => {
        let form = req.params;
        const dbx = new Dropbox({ accessToken: config.settings.DROPBOX_TOKEN });
        dbx.filesDownload({ path: `/${form.file}` })
            .then((data) => {
                console.log(data)
                // fs.WriteStream  .writeFile(data.result.name, data.result.fileBinary, 'binary', (err) => {
                //     if (err) { throw err; }
                //     console.log(`File: ${data.result.name} saved.`);
                    res.status(200).json({ error: 0, message: "OK" });
                // });
            })
            .catch((err) => {
                res.status(400).json({ error: 0, message: "NOT" });
                console.log(err);
                // throw err;
            });
    });
}

module.exports = modulo;