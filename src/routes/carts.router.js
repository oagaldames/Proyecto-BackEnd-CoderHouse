import { Router } from "express";
import {
  getCartByIdController,
  addCartController,
  addProductsToCartController,
  updateProductQuantityController,
  updateProductsToCartController,
  deleteProductCartController,
  deleteAllProductsCartController,
} from "../controllers/carts.controller.js";

const router = Router();

router.post("/", addCartController);

router.get("/:cid", getCartByIdController);

router.post("/:cid/product/:pid", addProductsToCartController);

router.put("/:cid/product/:pid", updateProductQuantityController);

router.put("/:cid", updateProductsToCartController);

router.delete("/:cid/product/:pid", deleteProductCartController);

router.delete("/:cid", deleteAllProductsCartController);

export { router as cartsRouter };
