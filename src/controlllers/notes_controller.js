import pool from "../config/db.js";

export const addNotes=async(req,res)=>{
  const {image,topPill,title,description,chips,publisher,rating,ratingCount,date,authorSub}=req.body;
  const adminId = req.admin.id;
   const pdfUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = "INSERT INTO notes(title,description,image,top_pill,chips,publisher,rating,rating_count,author_sub,pdf_url,adminid) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);";

  try {
    await pool.query(sql,[title,description,image,topPill,chips.split(","),publisher,rating,ratingCount,authorSub,pdfUrl,adminId]);
    
    return res.status(200).json({message:"Data inserted sucessfully"});
  } catch (error) {
    console.log("Insertion_Error:",error);
    return res.status(500).json({message:"problem in insertion"});
  }
}

export const fetchNotes = async (req,res)=>{
  const adminId = req.admin.id;

  const sql = "SELECT * FROM notes where adminid=$1;";
  try {
    const result = await pool.query(sql,[adminId]);
    
    if(result.rows.length === 0){
      return res.status(401).json({message:"Data not found"});
    }

    return res.status(200).json({message:"data fetched sucessfully",data:result.rows});
  } catch (error) {
    console.log("Fetching error:",error);
    res.status(500).json({message:"Data fetching problem"})
  }
}

export const deleteNotes = async (req,res)=>{
  const id = Number(req.params.id)  ;
  const adminId = req.admin.id;

  const sql = "DELETE FROM notes WHERE id=$1 AND adminid=$2;";

  try {
    const result = await pool.query(sql,[id,adminId]);
    return res.status(200).json({message:"data deleted sucessfully"});
  } catch (error) {
    console.log("DELETION_ERROR:",error);
    return res.status(500).json({message:"Deletion problem"});
  }
}

export const updateNotes = async (req, res) => {
  const id = Number(req.params.id);
  const adminId = req.admin.id;

  const {
    title,
    description,
    image,
    top_pill,
    chips,
    publisher,
    rating,
  } = req.body;

  const pdfUrl = req.file ? req.file.filename : null;

  const sql = `
    UPDATE notes
    SET 
      title = $1,
      description = $2,
      image = $3,
      top_pill = $4,
      chips = $5,
      publisher = $6,
      rating = $7,
      pdf_url = COALESCE($8, pdf_url)
    WHERE id = $9 AND adminid = $10
    RETURNING *;
  `;

  try {
    const result = await pool.query(sql, [
      title,
      description,
      image,
      top_pill,
      JSON.parse(chips),
      publisher,
      rating,
      pdfUrl,
      id,
      adminId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Note not found or unauthorized",
      });
    }

    return res.status(200).json({
      message: "Note updated successfully",
      note: result.rows[0],
    });
  } catch (error) {
    console.log("UPDATE_ERROR:", error);
    return res.status(500).json({ message: "Update failed" });
  }
};