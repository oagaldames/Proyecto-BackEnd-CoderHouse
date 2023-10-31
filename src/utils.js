import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
import bcrypt from "bcrypt";
import { PRIVATE_KEY_JWT } from "./config/contants.js";
import jwt from "jsonwebtoken";

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDirPath = dirname(currentFilePath);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const imgFolderPath = join(currentDirPath, "..", "src/public", "img");
    cb(null, imgFolderPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);
export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn: "24h" });
  return token;
};

export const uploader = multer({ storage });
