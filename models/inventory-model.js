const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* *************************
 * Get inventory item by inv_id
 * ************************* */
async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
        `SELECT * FROM public.inventory WHERE inv_id = $1`,
        [inv_id]
    )
    const carData = data.rows[0]
    console.log(`DEBUG 4: data = ${JSON.stringify(carData)})`)
    return data.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }  
}


     

/* *****************************
*   Register new clasification
* *************************** */
async function registerClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, registerClassification};
