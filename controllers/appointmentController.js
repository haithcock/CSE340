//location: controllers/appointmentController.js

const appointmentModel = require('../models/appointment-model');
const utilities = require('../utilities/');
const pool = require('../database/'); 
// appointmentController.js
async function buildScheduleForm(req, res) {
    console.log('Building schedule form for inv_id:', req.params.inv_id);
    try {
      const inv_id = req.params.inv_id;
      const nav = await utilities.getNav();
      console.log('Navigation data:', nav);
      
      res.render('appointments/schedule', {
        title: 'Schedule Test Drive',
        nav,
        inv_id,
        errors: null
      });
    } catch (error) {
      console.error('Error in buildScheduleForm:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  async function scheduleAppointment(req, res) {
    const { appointment_date, appointment_time, comments, inv_id } = req.body;
    const account_id = res.locals.accountData.account_id;
    const errors = [];
  
    // Validate date
    const selectedDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (isNaN(selectedDate) || selectedDate < today) {
      errors.push('Please select a valid future date');
    }
  
    // Validate time
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(appointment_time)) {
      errors.push('Please enter a valid time');
    }
  
    // Validate vehicle ID
    if (!inv_id || isNaN(inv_id)) {
      errors.push('Invalid vehicle selection');
    }
  
    // Check for validation errors
    if (errors.length > 0) {
      req.flash('error', errors.join(', '));
      return res.redirect(`/appointments/schedule/${inv_id}`);
    }
  
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
  
      const available = await appointmentModel.isSlotAvailable(appointment_date, appointment_time);
      if (!available) {
        throw new Error('Time slot already booked');
      }
  
      const result = await appointmentModel.scheduleAppointment({
        account_id,
        inv_id,
        appointment_date,
        appointment_time,
        comments
      });
  
      if (result.rowCount > 0) {
        await client.query('COMMIT');
        req.flash('notice', 'Test drive scheduled successfully!');
        return res.redirect('/appointments/account/appointments');
      } else {
        throw new Error('Failed to schedule appointment');
      }
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Appointment Scheduling Error:', error);
      req.flash('error', error.message || 'Database error occurred');
      return res.redirect(`/appointments/schedule/${inv_id}`);
    } finally {
      client.release();
    }
  
  
  
}
async function viewAppointments(req, res) {
  const account_id = res.locals.accountData.account_id;
  const nav = await utilities.getNav();
  const appointments = await appointmentModel.getAppointmentsByAccount(account_id);
  
  res.render('appointments/list', {
    title: 'My Appointments',
    nav,
    appointments: appointments.rows,
    errors: null
  });
}

module.exports = { buildScheduleForm, scheduleAppointment, viewAppointments };