var express = require("express");
var router = express.Router();
const ticketcontroller = require("../controllers/tickets.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*tickets*/
router.post("/tickets/addTickets",[authJwt.verifyToken], upload.single("file"), ticketcontroller.addTickets);
router.get("/tickets/getAllTickets", [authJwt.verifyToken],ticketcontroller.getAllTickets);
router.get("/tickets/getTicketsById",[authJwt.verifyToken],  ticketcontroller.getTicketsById);
router.delete("/tickets/deleteTickets", [authJwt.verifyToken], ticketcontroller.deleteTickets);
router.put("/tickets/updateTickets", [authJwt.verifyToken], ticketcontroller.updateTickets);



module.exports = router;
