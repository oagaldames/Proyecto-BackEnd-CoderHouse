import { Router } from "express";
import CartManager from "../dao/dbManagers/carts.manager.js";
import { uploader } from "../utils.js";
import {
  getCartByIdController,
  addCartController,
  addProductsToCartController,
} from "../controllers/carts.controller.js";

const router = Router();
const cartManager = new CartManager();

// Ruta para agregar un nuevo carrrito
router.post("/", addCartController);

router.get("/:cid", getCartByIdController);

// Ruta para agregar un nuevo producto al carrito seleccionado
router.post("/:cid/product/:pid", addProductsToCartController);
// router.post("/:cid/product/:pid", async (req, res) => {
//   try {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const quantity = 1;
//     const cart = await cartManager.addProductsToCart(cid, pid, quantity);

//     if (cart.success) {
//       res.status(200).send({ status: "success", Result: cart });
//     } else {
//       res.status(400).send({ status: "Error", message: cart });
//     }
//   } catch (error) {
//     res.status(500).send({ status: "Error", error: error.message });
//   }
// });

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const cart = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (cart.success) {
      res.status(200).send({ status: "success", result: cart });
    } else {
      res.status(400).send({ status: "Error", message: cart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = req.body.products;

    const cart = await cartManager.updateProductsToCart(cid, products);

    if (cart.success) {
      res.status(200).send({ status: "success", result: cart });
    } else {
      res.status(400).send({ status: "Error", message: cart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const deletedProductCart = await cartManager.deleteProductCart(cid, pid);
    if (deletedProductCart.success === true) {
      res.status(200).send({
        status: "success",
        message: `El producto con Id= ${pid}  se ha Eliminado correctamente.`,
      });
    } else {
      res.status(409).send({ error: deletedProductCart });
    }
  } catch (error) {}
});

router.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const deletedProductsCart = await cartManager.deleteAllProductsCart(cid);
    if (deletedProductsCart.success === true) {
      res.status(200).send({
        status: "success",
        message: `Los Productos del carrito con Id= ${cid}  se han Eliminado correctamente.`,
      });
    } else {
      res.status(409).send({ error: deletedProductsCart });
    }
  } catch (error) {}
});

export { router as cartsRouter };
