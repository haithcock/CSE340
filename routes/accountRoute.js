// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index") // This is where 'utilities' is declared
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation');

// Route to build inventory by classification view
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.get("/", utilities.checkLogin, utilities.handleErrors (accountController.buildLoggedIn)); // Default route to login
// Route to register a new account 
router.post(
    "/register",
    regValidate.registationRules(), // The rules to be used in validation
    regValidate.checkRegData,     // The call to run validation and handle errors
    utilities.handleErrors(accountController.registerAccount) // The call to the controller if no errors
  );

// Route to build vehicle view
//router.get("/detail/:vehicleId", invController.buildByVehicleId);
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  );


module.exports = router;