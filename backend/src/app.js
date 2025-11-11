const express = require("express");
const { join } = require("path");
const  config  = require("./config");

const app = express();

const routes = require("./routes");
const { errorHandler } = require("./middleware/error.middleware");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname,"./public")));

app.set("port", config.app.port || 5000);


app.use(routes);
app.use(errorHandler);

module.exports = app;
