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
//register new inventory
async function registerInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Image not found', 'Image not found', 1) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color])
  } catch (error) {
    return error.message
  }
} 
/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    // Check if any critical field is missing
    const needsExistingData = 
      inv_image === null || inv_image === undefined ||
      inv_thumbnail === null || inv_thumbnail === undefined ||
      classification_id === null || classification_id === undefined;

    let existingRecord = null;
    if (needsExistingData) {
      const existingResult = await pool.query(
        'SELECT inv_image, inv_thumbnail, classification_id FROM inventory WHERE inv_id = $1',
        [inv_id]
      );
      existingRecord = existingResult.rows[0];
    }

    // Prepare final values (use existing data if new values are missing)
    const finalImage = inv_image ?? existingRecord?.inv_image;
    const finalThumbnail = inv_thumbnail ?? existingRecord?.inv_thumbnail;
    const finalClassificationId = classification_id ?? existingRecord?.classification_id;

    // Validate required fields
    if (finalImage === null || finalThumbnail === null || finalClassificationId === null) {
      throw new Error("Missing required fields: inv_image, inv_thumbnail, or classification_id cannot be null");
    }

    // Execute update with validated values
    const sql = `
      UPDATE public.inventory 
      SET 
        inv_make = $1, 
        inv_model = $2, 
        inv_description = $3, 
        inv_image = $4, 
        inv_thumbnail = $5, 
        inv_price = $6, 
        inv_year = $7, 
        inv_miles = $8, 
        inv_color = $9, 
        classification_id = $10 
      WHERE inv_id = $11 
      RETURNING *
    `;
    
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      finalImage,
      finalThumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      finalClassificationId,  // Use validated classification_id
      inv_id
    ]);
    
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
    throw error;  // Re-throw for proper error handling upstream
  }
}


/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deletingInventory(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, registerClassification, registerInventory, updateInventory, deletingInventory};
