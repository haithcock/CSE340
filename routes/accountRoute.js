// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utlIndex = require("../utilities/index")
const accController = require("../controllers/accountController")
// Route to build inventory by classification view
router.get("/account/:accountId", accController.getMyaccount);


// Route to build vehicle view
router.get("/detail/:vehicleId", invController.buildByVehicleId);

module.exports = router;