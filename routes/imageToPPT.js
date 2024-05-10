const express = require("express");
const controller = require("../controllers/imageToPPTGenerator");


const router = express.Router();

router.get("/generate-ppt", controller.generatePPT);

module.exports = router;
