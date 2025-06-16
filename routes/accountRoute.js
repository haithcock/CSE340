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

//route to logout I think.
router.get("/logout", accountController.accountLogout);


//Display account update view
router.get("/update/:account_id", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdateAccount)
  
);

// Route to register a new account 
router.post(
    "/register",
    regValidate.registationRules(), // The rules to be used in validation
    regValidate.checkRegData,     // The call to run validation and handle errors
    utilities.handleErrors(accountController.registerAccount) // The call to the controller if no errors
  );


// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  );
//Handle account info update
router.post("/update-info",
  utilities.checkLogin,
  regValidate.updateAccountRules(),  // NEW VALIDATION
  regValidate.checkUpdateData,       // NEW VALIDATION HANDLER
  utilities.handleErrors(accountController.updateAccountInfo)
);
//Handle password change
router.post("/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),       // NEW VALIDATION
  regValidate.checkUpdateData,       // NEW VALIDATION HANDLER
  utilities.handleErrors(accountController.changePassword)
);


module.exports = router;