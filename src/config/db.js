import pg from "pg";
import dotenv from "dotenv";

const {Pool}=pg;
dotenv.config();

const pool = new Pool({
  host:process.env.DB_HOST,
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  port:process.env.POSTGRES_PORT,
  database:process.env.DB_NAME,
})

pool.connect((error)=>{
  if(error){
    console.log("DATABASE_CONNECTION_ERROR:",error);
  }else{
    console.log("Database connected sucessfully");
  }
});

export default pool;