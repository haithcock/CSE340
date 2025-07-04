//Location: ./server.js
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseControllers")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const accountRoute = require("./routes/accountRoute")
const appointmentRoute = require('./routes/appointmentRoute');
const errorTestRouter = require('./routes/errorTest')
const session = require("express-session")
const pool = require('./database/')

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(utilities.checkJWTToken)


/* ***********************
 * view engine and templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use('/account', accountRoute)
app.use(static)
//Index route
app.get('/', utilities.handleErrors(baseController.buildHome))

// Inventory routes

app.use("/inv", inventoryRoute)
app.use('/', errorTestRouter)

//route for appointments
app.use('/appointments', appointmentRoute);





/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

app.use(async (err, req, res, next) => {
  const status = err.status || 500;
  const nav = await utilities.getNav();

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message = status === 404
    ? err.message
    : 'Oh no! There was a crash. Maybe try a different route?';

  res.status(status).render('errors/error', {
    title: status,
    message,
    error: process.env.NODE_ENV === 'development' ? err : {},
    nav
  });
});


// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
