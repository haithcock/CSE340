// Location: routes/appointmentRoute.js
//  *************************/
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const utilities = require('../utilities/');

// Route to display the schedule form
router.get('/schedule/:inv_id', 
  utilities.checkLogin, 
  utilities.handleErrors(appointmentController.buildScheduleForm)
);

// Route to process the schedule form
router.post('/schedule', 
  utilities.checkLogin, 
  utilities.handleErrors(appointmentController.scheduleAppointment)
);

// Route to view appointments
router.get('/account/appointments', 
  utilities.checkLogin, 
  utilities.handleErrors(appointmentController.viewAppointments)
);




module.exports = router;