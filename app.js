const createError = require("http-errors");
const express = require("express");
const body_parser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const pptRouter = require("./routes/imageToPPT");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/ppt", pptRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const err_json = {
    error_status: err.status || 500,
    error_message: err.message,
  };

  res.format({
    "application/json"() {
      res.status(err.status || 500);
      res.json(err_json);
    },
  });
});

module.exports = app;
