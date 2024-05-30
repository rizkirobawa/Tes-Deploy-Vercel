const router = require("express").Router();
const {index}= require("../../controllers/flight.controllers");

router.get("/flights", index);

module.exports = router;

