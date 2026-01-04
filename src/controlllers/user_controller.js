import pool from "../config/db.js";

export const fetchNotes = async (req,res)=>{

  const sql = "SELECT * from notes;";
  try {
    const result = await pool.query(sql);
    if(result.rows == 0){
      return res.status(401).json({message:"Notes not found!"})
    }
    return res.status(200).json({message:"data fetched sucessfully",data:result.rows})
  } catch (error) {
    console.log("FETCHING_ERROR:",error);
    return res.status(500).json({message:"problem in fetching"});
  }
}