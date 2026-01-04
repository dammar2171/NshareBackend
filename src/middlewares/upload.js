import multer from "multer";
import multerConfig from "../config/multerConfig.js";

// Create a Multer instance using config
export const upload = multer({
  storage: multerConfig.storage,
  fileFilter: multerConfig.fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // optional: 10MB max
});
