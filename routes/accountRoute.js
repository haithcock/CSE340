// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
// Route to build inventory by classification view
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
// Route to register a new account
router.post("/register", utilities.handleErrors(accountController.registerAccount))



// Route to build vehicle view
//router.get("/detail/:vehicleId", invController.buildByVehicleId);

module.exports = router;