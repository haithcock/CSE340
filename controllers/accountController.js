const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null, // Ensure errors is set to null if it's rendered here
    })
    return
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again stupid.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver logged in view
* *************************************** */
async function buildLoggedIn(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/loggedIn", {
    title: "Account Home",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process logout request
* *************************************** */
async function accountLogout(req, res) {
  // Clear the JWT cookie
  res.clearCookie("jwt");
  
  // Redirect to home page
  res.redirect("/");

}
// Add to accountController.js

async function buildUpdateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav();
    const account_id = req.params.account_id;
    const accountData = await accountModel.getAccountById(account_id);
    
    // Get flash messages
    const notice = req.flash('notice');
    const error = req.flash('error');
    
    res.render("account/update", {
      title: "Update Account",
      nav,
      message: notice.length ? notice[0] : null, // Pass message to view
      errors: error.length ? error[0] : null,    // Pass errors to view
      accountData: accountData
    });
  } catch (error) {
    console.error("Error in buildUpdateAccount:", error);
    req.flash("error", "Error loading account update page");
    res.redirect("/account/");
  }
}

/* ****************************************
*  Update account information
* *************************************** */
async function updateAccountInfo(req, res) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      req.flash("notice", "Account information updated successfully");
    } else {
      req.flash("error", "Account update failed");
    }
    res.redirect("/account/");
  } catch (error) {
    console.error("Error in updateAccountInfo:", error);
    req.flash("error", "Server error during account update");
    res.redirect(`/account/update/${req.body.account_id}`);
  }
}


async function changePassword(req, res) {
  const { account_id, account_password } = req.body;
  
  // Complete password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{12,}$/;
  if (!passwordRegex.test(account_password)) {
    req.flash("error", "Password must be at least 12 characters with 1 uppercase, 1 number, and 1 special character");
    return res.redirect(`/account/update/${account_id}`);
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword);
    
    if (updateResult) {
      req.flash("notice", "Password updated successfully");
    } else {
      req.flash("error", "Password update failed");
    }
    res.redirect("/account/");
  } catch (error) {
    console.error("Error in changePassword:", error);
    req.flash("error", "Server error during password update");
    res.redirect(`/account/update/${account_id}`);
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildLoggedIn, accountLogout, buildUpdateAccount, updateAccountInfo, changePassword };
