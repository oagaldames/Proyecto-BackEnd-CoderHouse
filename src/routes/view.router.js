import { Router } from "express";
import ProductManager from "../dao/dbManagers/products.manager.js";
import CartManager from "../dao/dbManagers/carts.manager.js";
import { uploader } from "../utils.js";

const viewsRouter = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

viewsRouter.get("/:cid", async (req, res) => {
  try {
    const idcart = req.params.cid;
    const cartById = await cartManager.getCartById(idcart);
    if (cartById.success) {
      console.log(cartById);
      res.render("cart", { cart: cartById.cart });
    } else {
      res.status(404).send({ status: "error", message: cartById });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
});

viewsRouter.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || null;
  let query = {};

  if (req.query.category) {
    query = {
      category: req.query.category,
    };
  }
  query.stock = { $gt: 0 };

  const products = await productManager.getAllProducts({
    limit,
    page,
    sort,
    query,
  });

  products.prevLink = products.hasPrevPage
    ? `http://localhost:8080/products?page=${products.prevPage}`
    : "";
  products.nextLink = products.hasNextPage
    ? `http://localhost:8080/products?page=${products.nextPage}`
    : "";
  products.isValid = !(page <= 0 || page > products.totalPages);
  res.render("products", { products });
  console.log(products);
  console.log(products.hasNextPage);
  console.log(products.hasPrevPage);
  console.log(products.prevPage);
  console.log(products.nextPage);
  console.log(products.totalPages);
});

export default viewsRouter;
