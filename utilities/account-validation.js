
const utilities = require("./index.js")
const accountModel = require("../models/account-model")


//const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."),
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."),
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ];
}
validate.loginRules = () => {
  return [
    // Email: Normalize and validate
    body("account_email")
      .trim()
      .escape()
      .normalizeEmail()
      .isEmail()
      .withMessage("A valid email is required."),

    // Password: Basic validation
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ];
};
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  const result = validationResult(req); // Get validation result
  if (!result.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors: result.array(), // Convert to array
      account_email,
    });
    return;
  }
  next();
};

validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const result = validationResult(req); // Get validation result
  if (!result.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/register", {
      errors: result.array(), // Convert to array
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};


// Account update validation rules
validate.updateAccountRules = () => [
  body("account_firstname")
    .trim()
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters'),
  
  body("account_lastname")
    .trim()
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters'),
  
  body("account_email")
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
];

// Password validation rules
validate.passwordRules = () => [
  body("account_password")
    .isLength({ min: 12 })
    .withMessage('Password must be at least 12 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character')
];

// Validation result handler
validate.checkUpdateData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    req.flash('error', errorMessages.join(', '));
    return res.redirect(`/account/update/${req.body.account_id}`);
  }
  next();
};
  module.exports = validate;