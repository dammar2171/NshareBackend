import pool from "../config/db.js"
import bcrypt from "bcrypt";

export const loginAdmin= async(req,res)=>{
  const {email,password} = req.body;

  const psd="admin";

  const hashedPsd= bcrypt.hash(psd,10);

  console.log(hashedPsd);

}

