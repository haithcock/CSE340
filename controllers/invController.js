const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* *************************
 * Build inventory by vehicle ID view
 * ************************* */
invCont.buildByVehicleId = async function (req, res, next) {
  console.log("DEBUG 1: Runninge invCont.bildByVehicleId")
  console.log(`DEBUG 2: req.params.vehicleId = ${req.params.vehicleId}`)
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getInventoryByInventoryId(vehicle_id)
  console.log(`DEBUG 3: data = ${JSON.stringify(data)})`)
  const grid = await utilities.buildVehicleGrid(data)
  let nav = await utilities.getNav()
  const car_id = data[0].inv_id
  const make  = data[0].inv_make
  const model = data[0].inv_model
  const year  = data[0].inv_year
  const description = data[0].inv_description
  const mileage = data[0].inv_miles
  console.log(`DEBUG 5: make/model/year/car-id = ${make} ${model} ${year} ${car_id} ${description} ${mileage}`)
  res.render("./inventory/classification", {
      title: make + " " + model + " " + year,
      nav,
      grid,
  })
}


module.exports = invCont