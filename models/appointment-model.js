//Location : ./models/appointment-model.js

const pool = require('../database/');

module.exports = {

  async scheduleAppointment(appointmentData) {
    const sql = `INSERT INTO appointments 
                (account_id, inv_id, appointment_date, appointment_time, comments) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    return await pool.query(sql, [
      appointmentData.account_id,
      appointmentData.inv_id,
      appointmentData.appointment_date,
      appointmentData.appointment_time,
      appointmentData.comments
    ]);
  },

  async getAppointmentsByAccount(account_id) {
    const sql = `SELECT a.*, inv_make, inv_model 
                FROM appointments a
                JOIN inventory i ON a.inv_id = i.inv_id
                WHERE account_id = $1
                ORDER BY appointment_date DESC`;
    return await pool.query(sql, [account_id]);
  },

  async getAppointmentById(appointment_id) {
    const sql = `SELECT * FROM appointments WHERE appointment_id = $1`;
    return await pool.query(sql, [appointment_id]);
  },

  async isSlotAvailable(date, time) {
    const sql = `SELECT * FROM appointments 
                WHERE appointment_date = $1 
                AND appointment_time = $2`;
    const result = await pool.query(sql, [date, time]);
    return result.rowCount === 0;
  }

};
