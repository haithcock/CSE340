// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const regValidate = require("../utilities/classification-validation")

// Route to build inventory by classification view (PUBLIC - no auth needed)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle view (PUBLIC - no auth needed)
router.get("/detail/:vehicleId", invController.buildByVehicleId);

// START OF CHANGES ================>
//Route to build inventory management view (PROTECTED)
router.get("", 
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType, // NEW MIDDLEWARE
  invController.buildManagement
);

//Route to build add new classification view (PROTECTED)
router.get("/addClass", 
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType, // NEW MIDDLEWARE
  invController.buildAddClassification
);

//Route to build add new inventory view (PROTECTED)
router.get("/addInv", 
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType, // NEW MIDDLEWARE
  invController.buildAddInventory
);

//route to modify inventory (PROTECTED)
router.get("/edit/:inv_id", 
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType, // NEW MIDDLEWARE
  utilities.handleErrors(invController.buildModifyInventoryPage)
);

//route to delete inventory (PROTECTED)
router.get("/delete/:inv_id", 
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAccountType, // NEW MIDDLEWARE
  utilities.handleErrors(invController.buildDeleteInventory)
);
// END OF CHANGES ================>

//route to manage inventory by classification (LEAVE AS-IS)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// POST routes remain the same (they inherit protection from GET routes)
router.post(
    '/addClass',
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.registerClassification),
);

router.post(
    '/addInv',
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.registerInventory),
);

router.post(
    "/update/",
    regValidate.inventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

router.post(
    "/delete/",
    utilities.handleErrors(invController.deleteInventory))    

module.exports = router;