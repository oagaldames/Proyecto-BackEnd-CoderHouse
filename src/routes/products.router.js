import { Router } from "express";
import { uploader } from "../utils.js";
import {
  getAllProductController,
  getProductIdController,
  addProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getAllProductController);

// Ruta para obtener un producto por ID
router.get("/:pid", getProductIdController);

// Ruta para agregar un nuevo producto
router.post("/", uploader.array("Thumbnail"), addProductController);

// Ruta para actualizar un producto por ID
router.put("/:pid", uploader.array("Thumbnail"), updateProductController);

// Ruta para eliminar un producto por ID
router.delete("/:pid", deleteProductController);

export { router as productRouter };
