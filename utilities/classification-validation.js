const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid classification name.")
  ]
}
validate.validateClassification = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors below.")
    return res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav: utilities.getNav(),
      errors: errors.array()
    })
  }
  next()
}



validate.checkClassificationExists = async (req, res, next) => {
  const { classification_name } = req.body
  const exists = await utilities.invModel.checkClassificationExists(classification_name)
  if (exists) {
    req.flash("notice", "Classification already exists. Please choose a different name.")
    return res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav: utilities.getNav(),
      errors: null,
      classification_name
    })
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .matches(/^(19|20)\d{2}$/)
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid year in the format YYYY (e.g., 2023)."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a valid description."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a valid price."),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a valid mileage."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid color."),
  ]
}
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors: errors.array(),
      title: "Add Inventory",
      nav,
      ...req.body // To repopulate the form with entered data
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(req.body.classification_id)
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      inv_id: req.params.inv_id, //double check this later if you get errors koda
      title: "Edit Vehicle",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body, // Sticky values
    })
    return
  }
  next()
}

validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add Classification",
      nav,
      ...req.body // To repopulate the form with entered data
    })
    return
  }
  next()
}




module.exports = validate;