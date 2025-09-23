var express = require("express");
var router = express.Router();
const controller = require("../controllers/chat.controller");
var { authJwt } = require("../middleware");

/*addChat*/
router.post("/chat/addChat", [authJwt.verifyToken],[controller.validate("addChat")], controller.addChat);

/*getAllChat*/
router.get("/chat/getAllChat", [authJwt.verifyToken],[controller.validate("getAllChat")], controller.getAllChat);

/*deleteMessage*/
router.delete("/chat/deleteMessage", [authJwt.verifyToken],[controller.validate("deleteMessage")], controller.deleteMessage);

/*updateMessage*/
router.put("/chat/updateMessage", [authJwt.verifyToken],[controller.validate("updateMessage")], controller.updateMessage);


module.exports = router;
