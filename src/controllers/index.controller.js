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
                        res.status(200).json({ error: 0, title:"Confirmación", message: "Archivo Cargado con éxito", file: req.file.filename});
                    })
                    .catch((uploadErr) => {
                        res.status(200).json(uploadErr);
                    });

            });
        } else {
            res.status(401).json(err);
        }
    });
}
modulo.download = async (req, res, next) => {
    params(req, res, async (err) => {
        let form = req.params;
        const dbx = new Dropbox({ accessToken: config.settings.DROPBOX_TOKEN });
        dbx.filesDownload({ path: `/${form.file}` })
            .then((data) => {
                res.end(data.result.fileBinary, 'binary');
            })
            .catch((err) => {
                res.status(400).json({ error: 0,title:"Error", message: "NOT" });
                console.log(err);
            });
    });
}
modulo.delete = async (req, res, next) => {
    params(req, res, async (err) => {
        let form = req.body;
        console.log(form)
        const dbx = new Dropbox({ accessToken: config.settings.DROPBOX_TOKEN });
        dbx.filesDeleteV2({ path: `/${form.file}` })
            .then((data) => {
                res.status(200).json({ error: 0, title: "Confirmación", message: "Archivo Eliminado" });
            })
            .catch((err) => {
                res.status(400).json({ error: 0,title:"Error", message: "NOT" });
                console.log(err);
            });
    });
}

module.exports = modulo;