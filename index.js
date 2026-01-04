import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import admin_route from "./src/routes/admin_route.js";
import notes_route from "./src/routes/notes_route.js";

const app = express();
dotenv.config();

app.use(cors({
  origin:["http://localhost:5173","http://localhost:5174"],
  methods:["POST","GET","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"],
}))

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/",(req,res)=>{
  res.send("server running sucessfully!");
})

app.use("/admin",admin_route);
app.use("/notes",notes_route);

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
})