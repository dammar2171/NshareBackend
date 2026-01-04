import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admin WHERE email = $1;";
  try {
    const result = await pool.query(sql, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const response = result.rows[0];

    const isValid = await bcrypt.compare(password, response.password);
    if (!isValid) {
      return res.status(401).json({ message: "Credentials do not match!" });
    }

    const token = jwt.sign(
      { id: response.id, email: response.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("Database problem:", error);
    return res.status(500).json({ message: "Problem in database" });
  }
};