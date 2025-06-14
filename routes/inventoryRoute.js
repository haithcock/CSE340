// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const regValidate = require("../utilities/classification-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build vehicle view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

//Route to build inventory management view
router.get("", invController.buildManagement);

//Route to build add new classification view
router.get("/addClass", invController.buildAddClassification);
router.get("/addInv", invController.buildAddInventory);

//route to manage inventory by classification
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//route to modify inventory
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildModifyInventoryPage))
//route to delete inventory
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))
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
   // regValidate.inventoryRules(),
   // regValidate.checkUpdateData,
    utilities.handleErrors(invController.deleteInventory))    



module.exports = router;