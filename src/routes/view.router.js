import { Router } from "express";
import ProductManager from "../dao/dbManagers/products.manager.js";
import CartManager from "../dao/dbManagers/carts.manager.js";
import { productsModel } from "../dao/models/product.model.js";
import { uploader } from "../utils.js";

const viewsRouter = Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

viewsRouter.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

viewsRouter.get("/chat", (req, res) => {
  res.render("chat", {});
});

viewsRouter.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, category } = req.query;

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      sort: {
        price: Number(sort),
      },
      lean: true,
    };

    if (!(options.sort.price === -1 || options.sort.price === 1)) {
      delete options.sort;
    }

    const listaproductos = await productsModel.paginate({}, options);

    res.render("products", {
      js: "products.js",
      listaproductos,
    });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consultar productos", mensaje: error });
  }
});

export default viewsRouter;
