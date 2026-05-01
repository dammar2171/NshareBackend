import multer from "multer";
import multerConfig from "../config/multerConfig.js";

export const uploadPDF = multer({
  storage: multerConfig.storage,
  fileFilter: multerConfig.fileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadFile = multer({
  storage: multerConfig.storage,
  fileFilter: multerConfig.imageOrPdfFilter,  
  limits: { fileSize: 10 * 1024 * 1024 },
});