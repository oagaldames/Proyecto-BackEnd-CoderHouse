import { Router } from "express";
import ProductManager from "../dao/dbManagers/products.manager.js";
import { uploader } from "../utils.js";

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener todos los productos con límite opcional
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getAllProducts(limit);
    res.send({ status: "success", payload: products });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});
// Ruta para obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const idProduct = req.params.pid;
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
router.post("/", uploader.array("Thumbnail"), async (req, res) => {
  try {
    let pathThumbnail = [];
    if (req.files) {
      const arrayFiles = req.files;
      pathThumbnail = arrayFiles.map((item) => item.path);
    } else {
      pathThumbnail = [];
    }
    const productData = req.body;

    // Crea un nuevo producto utilizando el modelo de Mongoose
    const result = await productManager.addProduct({
      ...productData,
      thumbnail: pathThumbnail,
    });

    res.status(201).send({
      message: "Producto creado correctamente",
      cart: result,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

// Ruta para actualizar un producto por ID
router.put("/:pid", uploader.array("Thumbnail"), async (req, res) => {
  let pathThumbnail = [];
  try {
    if (req.files) {
      const arrayFiles = req.files;
      pathThumbnail = arrayFiles.map((item) => item.path);
    } else {
      pathThumbnail = [];
    }
    const idProduct = req.params.pid;
    const productData = req.body;
    const updatedProduct = await productManager.updateProduct(
      idProduct,
      productData,
      pathThumbnail
    );
    if (updatedProduct) {
      res.status(200).send({
        status: "success",
        message: `El producto con Id= ${idProduct}  se ha Modificado correctamente.`,
        updatedProduct,
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
  const idProduct = req.params.pid;
  const deletedProduct = await productManager.deleteProduct(idProduct);
  try {
    if (deletedProduct === true) {
      res.status(200).send({
        status: "success",
        message: `El producto con Id= ${idProduct}  se ha Eliminado correctamente.`,
      });
    } else {
      res.status(409).send({ error: deletedProduct });
    }
  } catch (error) {}
});

export { router as productRouter };
