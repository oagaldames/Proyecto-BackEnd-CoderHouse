import express from "express";
const router = express.Router();
import ProductManager from "../models/ProductManager.js";

// Crear una instancia de ProductManager con tu archivo JSON
const productManager = new ProductManager("./data/products.json");

// Ruta para obtener todos los productos con límite opcional
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    //res.status(200).send(products);
    //res.send(products);
    res.status(200).send({ status: "success", products });
  } catch (error) {
    res.status(500).send({ message: "Error interno del servidor" });
  }
});

// Ruta para obtener un producto por ID
router.get("/:pid", (req, res) => {
  const { pid } = req.params;
  const product = productManager.getProductById(Number(pid));
  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
  } else {
    res.status(200).json(product);
  }
});

// Ruta para agregar un nuevo producto
router.post("/", (req, res) => {
  const productData = req.body;
  const newProduct = productManager.addProduct(productData);
  if (!newProduct) {
    res.status(400).json({ error: "No se pudo agregar el producto" });
  } else {
    res.status(201).json(newProduct);
  }
});

// Ruta para actualizar un producto por ID
router.put("/:pid", (req, res) => {
  const { pid } = req.params;
  const productData = req.body;
  const updatedProduct = productManager.updateProduct(Number(pid), productData);
  if (!updatedProduct) {
    res.status(404).json({ error: "Producto no encontrado" });
  } else {
    res.status(200).json(updatedProduct);
  }
});

// Ruta para eliminar un producto por ID
router.delete("/:pid", (req, res) => {
  const { pid } = req.params;
  const deletedProduct = productManager.deleteProduct(Number(pid));
  if (!deletedProduct) {
    res.status(404).json({ error: "Producto no encontrado" });
  } else {
    res.status(204).send(); // No Content, ya que se eliminó el producto
  }
});

export { router as productRouter };
