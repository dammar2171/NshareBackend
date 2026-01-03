import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

app.use(cors({
  origin:["http://localhost:5173/","http://localhost:5174/"],
  methods:["POST","GET","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"],
}))

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
  res.send("server running sucessfully!");
})

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})