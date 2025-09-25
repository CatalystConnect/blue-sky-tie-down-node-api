var express = require("express");
var router = express.Router();
const Contactscontroller = require("../controllers/contacts.controller");
var { authJwt } = require("../middleware");
let { upload } = require("../../../config/multer.config");

/*LeadStatuses*/
router.post("/Contacts/addContacts",[authJwt.verifyToken], upload.none(), Contactscontroller.addContacts);
router.get("/Contacts/getAllContacts", [authJwt.verifyToken],Contactscontroller.getAllContacts);
router.get("/Contacts/getContactsById",[authJwt.verifyToken],  Contactscontroller.getContactsById);
router.delete("/Contacts/deleteContacts", [authJwt.verifyToken], Contactscontroller.deleteContacts);
router.put("/Contacts/updateContacts", [authJwt.verifyToken],upload.none(), Contactscontroller.updateContacts);


module.exports = router;