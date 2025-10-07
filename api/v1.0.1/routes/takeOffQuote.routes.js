var express = require("express");
var router = express.Router();
const controller = require("../controllers/takeOffQuotes.controller");
var { authJwt } = require("../middleware");


/*addTakeOffQuote*/
router.post("/takeOffQuote/addTakeOffQuote",[authJwt.verifyToken],[controller.validate("addTakeOffQuote")], controller.addTakeOffQuote);

/*getAllRoles*/
router.get("/takeOffQuote/getAllTakeOffQuote",[authJwt.verifyToken],[controller.validate("getAllTakeOffQuote")],  controller.getAllTakeOffQuote);

/*getTakeOffQuoteById*/
router.get("/takeOffQuote/getTakeOffQuoteById",[authJwt.verifyToken], [controller.validate("getTakeOffQuoteById")], controller.getTakeOffQuoteById);

/*updateTakeOffQuoteById*/
router.put("/takeOffQuote/updateTakeOffQuoteById",[authJwt.verifyToken], [controller.validate("getTakeOffQuoteById")], controller.updateTakeOffQuoteById);

/*deleteTakeOffQuoteById*/
router.delete("/takeOffQuote/deleteTakeOffQuoteById",[authJwt.verifyToken], [controller.validate("getTakeOffQuoteById")], controller.deleteTakeOffQuoteById);

module.exports = router;

