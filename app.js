const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const youtubeRouter = require("./routes/youtube");

const app = express();

// app.use(cors);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/youtube", youtubeRouter);

module.exports = app;
