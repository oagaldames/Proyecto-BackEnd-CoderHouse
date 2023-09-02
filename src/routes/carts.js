import express from "express";
const router = express.Router();
import CartManager from "../models/CartManager.js";

// Crear una instancia de CartManager con tu archivo JSON
const cartManager = new CartManager("./data/carts.json");
// Ruta para agregar un nuevo cart
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();

    if (newCart === true) {
      res.status(201).send({
        message: "Producto creado correctamente",
        cart: newCart,
      });
    } else {
      res.status(400).send({ message: newCart });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const carts = await cartManager.getCarts();
    if (limit) {
      const limitedcarts = carts.slice(0, limit);
      res.status(200).send({ status: "success", limitedcarts });
    } else {
      res.status(200).send({ status: "success", carts });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const idcart = parseInt(req.params.cid);
    const cartById = await cartManager.getCartById(idcart);
    if (cartById) {
      res.status(200).send({ status: "success", cartById });
    } else {
      res.status(404).send({ error: "carrito no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

export { router as cartsRouter };
