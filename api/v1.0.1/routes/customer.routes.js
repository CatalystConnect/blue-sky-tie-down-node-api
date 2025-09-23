var express = require("express");
var router = express.Router();
const controller = require("../controllers/customer.controller");
var { authJwt } = require("../middleware");

/*register*/
router.post("/customer/customerAdd",[controller.validate("customerAdd")], controller.customerAdd);

/*getAllCustomer*/
router.get("/customer/getAllCustomer", controller.getAllCustomer);

/*getCustomerById*/
router.get("/customer/getCustomerById", [authJwt.verifyToken],[controller.validate("getCustomerById")], controller.getCustomerById);

/*updateCustomer*/
router.put("/customer/updateCustomer", [authJwt.verifyToken],[controller.validate("getCustomerById")], controller.updateCustomer);

/*deleteCustomer*/
router.delete("/customer/deleteCustomer", [authJwt.verifyToken],[controller.validate("getCustomerById")], controller.deleteCustomer);




module.exports = router;
