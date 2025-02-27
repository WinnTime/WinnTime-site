const express = require("express");
const router = express.Router();

const { tracker } = require("../controllers/stopScheduleController");

router.post("/tracker", tracker);


module.exports = router;