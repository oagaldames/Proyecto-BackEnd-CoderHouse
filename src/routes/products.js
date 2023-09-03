import express from "express";
const router = express.Router();
import ProductManager from "../models/ProductManager.js";

// Instancia de Clase ProductManager con archivo JSON /data/products.json
const productManager = new ProductManager("./data/products.json");

// Ruta para obtener todos los productos con límite opcional
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.status(200).send({ status: "success", limitedProducts });
    } else {
      res.status(200).send({ status: "success", products });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const idProduct = parseInt(req.params.pid);
    const productById = await productManager.getProductById(idProduct);
    if (productById) {
      res.status(200).send({ status: "success", productById });
    } else {
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);

    if (typeof newProduct === "string") {
      res.status(409).send({ message: newProduct });
    } else {
      res.status(201).send({
        message: "Producto creado correctamente",
        product: newProduct,
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para actualizar un producto por ID
router.put("/:pid", async (req, res) => {
  try {
    const idProduct = parseInt(req.params.pid);
    const productData = req.body;
    const updatedProduct = await productManager.updateProduct(
      idProduct,
      productData
    );
    if (updatedProduct === true) {
      res.status(200).send({
        message: `El producto con Id= ${idProduct}  se ha Modificado correctamente.`,
      });
    } else {
      res.status(400).json({ error: updatedProduct });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  const idProduct = parseInt(req.params.pid);
  const deletedProduct = await productManager.deleteProduct(idProduct);
  try {
    if (deletedProduct === true) {
      res.status(200).send({
        message: `El producto con Id= ${idProduct}  se ha Eliminado correctamente.`,
      });
    } else {
      res.status(409).send({ error: deletedProduct });
    }
  } catch (error) {}
});

export { router as productRouter };
