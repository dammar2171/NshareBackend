import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next)=>{
  const authHeader = req.header.authorization;

  if(!authHeader){
    return res.status(401).json({message:"Missing or invalid token"});
  }

  const token = authHeader.split("")[0];

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.admin=decoded;
  } catch (error) {
    return res.status(400).json({message:"invalid or expired token"});
  }
}

export default authMiddleware;