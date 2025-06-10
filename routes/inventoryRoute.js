// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build vehicle view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

//Route to build inventory management view
router.get("", invController.buildManagement);

//Route to build add new classification view
router.get("/addClass", invController.buildAddClassification);

router.post('/addClass', utilities.handleErrors(invController.registerClassification));

module.exports = router;