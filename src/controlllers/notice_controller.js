
import pool from "../config/db.js";

export const addNotice = async (req, res) => {
  const { description, publisher, date, hashtags } = req.body;
  
  const parsedHashtags = hashtags ? JSON.parse(hashtags) : [];
  const fileUrl = req.file
    ? `http://localhost:5000/uploads/${req.file.filename}`
    : "";

  // detect file type from mimetype
  const fileType = req.file
    ? req.file.mimetype === "application/pdf" ? "pdf" : "image"
    : "";

  try {
    const result = await pool.query(
      `INSERT INTO notices (description, publisher, file_url, file_type, hashtags, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [description, publisher, fileUrl, fileType, parsedHashtags, date]
    );

    res.status(201).json({
      message: "Notice added successfully",
      notice: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to add notice", error: err.message });
  }
};

// FETCH ALL NOTICES
export const fetchNotices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notices ORDER BY date DESC`
    );
    res.status(200).json({ notices: result.rows });

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notices", error: err.message });
  }
};

// DELETE NOTICE
export const deleteNotice = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM notices WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json({ message: "Notice deleted", deletedId: Number(id) });

  } catch (err) {
    res.status(500).json({ message: "Failed to delete notice", error: err.message });
  }
};