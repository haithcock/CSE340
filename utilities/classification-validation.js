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
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
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





module.exports = validate;