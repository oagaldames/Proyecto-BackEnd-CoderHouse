import { Router } from "express";
import CartManager from "../dao/dbManagers/carts.manager.js";
import { uploader } from "../utils.js";

const router = Router();
const cartManager = new CartManager();

// Ruta para agregar un nuevo carrrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    if (newCart.success) {
      res.status(201).send({ status: "success", Result: newCart });
    } else {
      res.status(400).send({ status: "error", message: newCart });
    }
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
});
// Ruta para obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const idcart = req.params.cid;
    const cartById = await cartManager.getCartById(idcart);
    if (cartById.success) {
      res.status(200).send({ status: "success", Result: cartById });
    } else {
      res.status(404).send({ status: "error", message: cartById });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
});

// Ruta para agregar un nuevo producto al carrito seleccionado si no existe
//si el producto existe suma 1 a la cantidad existente
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = 1;
    const cart = await cartManager.addProductsToCart(cid, pid, quantity);

    if (cart.success) {
      res.status(200).send({ status: "success", Result: cart });
    } else {
      res.status(400).send({ status: "Error", message: cart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
});

export { router as cartsRouter };
