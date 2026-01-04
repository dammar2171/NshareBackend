import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next)=>{
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({message:"Missing  token"});
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.admin=decoded;
    next();
  } catch (error) {
    return res.status(400).json({message:"invalid or expired token"});
  }
}

export default authMiddleware;