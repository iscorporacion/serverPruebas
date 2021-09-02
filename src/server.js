require("dotenv").config();
const config = require("./config");
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const app = express();

const routes = require("./routes/rutas.routes");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon', 'favicon.ico')));
app.use(express.static(path.resolve(__dirname,'../node_modules')));

app.use(routes);

app.listen(config.settings.PORT, () => {
    console.log(`App listening at http://localhost:${config.settings.PORT}`);
});