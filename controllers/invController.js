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

/* *************************
 * Build inventory management view
 * ************************* */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()

  const classificationSelect = await utilities.buildClassificationList()

  
  res.render("./inventory/management", {
    classificationSelect,
    title: "Inventory Management",
    nav,
    errors:null
  })
}

/* *************************
 * Build new classification view
 * ************************* */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors:null
  })
}

/* *************************
 * Build new inventory view
 * ************************* */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    classificationSelect,
    title: "Add Inventory",
    nav,
    errors:null
  })
}


/* *************************
 * Register new classification
 * ************************* */
invCont.registerClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  // Validate the classification name
//if (!classification_name || classification_name.trim() === "") {
 //   req.flash("notice", "Please enter a valid classification name.")
   // return res.render("./inventory/add-classification", {
   //   title: "Add Classification",
    //  nav,
    //  errors: null
    //})
  // }

  // Register the new classification
  const regResult = await invModel.registerClassification(classification_name)

  if (regResult) {
    req.flash("notice", "Classification added successfully.")
    return res.redirect("/inv")
  } else {
    req.flash("notice", "Error adding classification. Please try again.")
    return res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

/* *************************
 * Register new inventory item
 * ************************* */
invCont.registerInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color} = req.body

  const regResult = await invModel.registerInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color
  )
  if (regResult) {
    req.flash("notice", "Inventory item added successfully.")
    return res.redirect("/inv")
  } else {
    req.flash("notice", "Error adding inventory item. Please try again.")
    return res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null
    })
  }


}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* *************************
 * invCont.buildModifyInventoryPage = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id) 
  const invData = await invModel.getInventoryByInventoryId(inv_id)
  let nav = await utilities.getNav()
  
  res.render("./inventory/edit-inventory", {
    invData,
    title: "Add Inventory",
    nav,
    errors:null
  })
}
 * ************************* */
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildModifyInventoryPage = async function (req, res, next) {
  console.log('Starting buildModifyInventoryPage function');
  try {
    const inv_id = parseInt(req.params.inv_id);
    console.log(`Parsed inventory ID: ${inv_id}`);

    console.log('Getting navigation data...');
    let nav = await utilities.getNav();
    console.log('Navigation data retrieved');

    console.log(`Fetching inventory data for ID: ${inv_id}...`);
    const itemData = await invModel.getInventoryByInventoryId(inv_id);
    console.log('Inventory data retrieved:', itemData);

    const item = itemData[0]; // <-- This is the key fix
    if (!item) {
      throw new Error(`No inventory item found with ID: ${inv_id}`);
    }


    console.log('Building classification list...');
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    console.log('Classification list built');

    const itemName = `${item.inv_make} ${item.inv_model}`;
    console.log(`Preparing to render view for: ${itemName}`);

    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: item.inv_id,
      inv_make: item.inv_make,
      inv_model: item.inv_model,
      inv_year: item.inv_year,
      inv_description: item.inv_description,
      inv_image: item.inv_image,
      inv_thumbnail: item.inv_thumbnail,
      inv_price: item.inv_price,
      inv_miles: item.inv_miles,
      inv_color: item.inv_color,
      classification_id: item.classification_id
    });
    console.log('Render completed successfully');
  } catch (error) {
    console.error('Error in buildModifyInventoryPage:', error);
    next(error); // Make sure to pass the error to the error-handling middleware
  }
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont;
