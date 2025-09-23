var express = require("express");
var router = express.Router();
const controller = require("../controllers/notes.controller");
var { authJwt } = require("../middleware");


/*addNotes*/
router.post("/notes/addNotes",[authJwt.verifyToken], [controller.validate("addNotes")], controller.addNotes);

/*getNoteById*/
router.get("/notes/getNoteById",[authJwt.verifyToken], [controller.validate("getNoteById")], controller.getNoteById);

/*getNoteById*/
router.delete("/notes/deleteNoteById",[authJwt.verifyToken], [controller.validate("deleteNoteById")], controller.deleteNoteById);

module.exports = router;
