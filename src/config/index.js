let config = {};

config.settings = {
    PORT: process.env.PORT || 3000,
    DROPBOX_TOKEN: process.env.DROPBOX_TOKEN,
    folders: {
        archivos: process.env.APP_FILES_DIR
    },
    imageTypes:"jpg,png,jpeg,gif",
}

module.exports = config;