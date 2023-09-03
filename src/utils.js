import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDirPath = dirname(currentFilePath);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const imgFolderPath = join(currentDirPath, "..", "public", "img");
    cb(null, imgFolderPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExt = extname(file.originalname);
    const fileName = `${timestamp}${fileExt}`;
    cb(null, fileName);
  },
});

export const uploader = multer({ storage });

// Función para generar el nombre de archivo con timestamp y nombre original
export function generateFileNameWithTimestamp(file) {
  const timestamp = Date.now();
  const fileExt = extname(file.originalname);
  const originalFileName = file.originalname.replace(fileExt, ""); // Eliminar la extensión del nombre original
  return `${timestamp}-${originalFileName}${fileExt}`;
}
