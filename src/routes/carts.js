import express from "express";
const router = express.Router();
import CartManager from "../models/CartManager.js";

// Instancia de Clase CartManager con archivo JSON /data/carts.json
const cartManager = new CartManager("./data/carts.json");

// Ruta para agregar un nuevo carrrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();

    if (newCart.success) {
      res.status(201).send({ Result: newCart });
    } else {
      res.status(400).send({ message: newCart });
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
    if (cartById.success) {
      res.status(200).send({ Result: cartById });
    } else {
      res.status(404).send({ message: cartById });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

// Ruta para agregar un nuevo producto al carrito seleccionado si no existe
//si el producto existe suma 1 a la cantidad existente
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const quantity = 1;
    const cart = await cartManager.addProductsToCart(cid, pid, quantity);

    if (cart.success) {
      res.status(200).send({ Result: cart });
    } else {
      res.status(400).send({ message: cart });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
});

export { router as cartsRouter };
