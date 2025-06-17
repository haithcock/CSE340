const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
/* ***************************
 * Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const vehicles = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(vehicles);
  let nav = await utilities.getNav();
  const className = vehicles[0].classification_name;
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    vehicles,
    context: { // Add context object
      isDetailView: false
    }
  });
}

/* *************************
 * Build inventory by vehicle ID view
 * ************************* */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId;
  const vehicles = await invModel.getInventoryByInventoryId(vehicle_id);
  const grid = await utilities.buildVehicleGrid(vehicles);
  let nav = await utilities.getNav();
  
  res.render("./inventory/classification", {
    title: vehicles[0].inv_make + " " + vehicles[0].inv_model + " " + vehicles[0].inv_year,
    nav,
    grid,
    vehicles,
    context: { // Add context object
      isDetailView: true
    }
  });
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



/* ***************************
 *  Build DELETE inventory view and deliver the page
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
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

    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
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
    console.error('Error in buildDeleteInventory:', error);
    next(error); // Make sure to pass the error to the error-handling middleware
  }
}



/* ***************************
 *  DELETE Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id);
  console.log(`Parsed inventory ID: ${inv_id}`);

  console.log(`Fetching inventory data for ID: ${inv_id}...`);
  const itemData = await invModel.getInventoryByInventoryId(inv_id);
  console.log('Inventory data retrieved:', itemData);

  const item = itemData[0]; // <-- This is the key fix
  if (!item) {
    throw new Error(`No inventory item found with ID: ${inv_id}`);
  }

  const itemName = item.inv_make + " " + item.inv_model

  const updateResult = await invModel.deletingInventory(
    inv_id  
    /*
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
    */
  )

  if (updateResult) {
    req.flash("notice", `The ${itemName} was successfully DELETED.`)
    res.redirect("/inv/")
  } else {

    console.log('Building classification list...');
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    console.log('Classification list built');

    req.flash("notice", "Sorry, the DELETION failed.")
    res.status(501).render("inventory/delete-confirm", {
    
        title: "Delete " + itemName,
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
    })
  }
}

module.exports = invCont;
