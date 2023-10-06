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

// viewsRouter.get("/products", async (req, res) => {
//   const limit = parseInt(req.query.limit) || 10;
//   const page = parseInt(req.query.page) || 1;
//   const sort = req.query.sort || null;
//   let query = {};

//   if (req.query.category) {
//     query = {
//       category: req.query.category,
//     };
//   }
//   query.stock = { $gt: 0 };

//   //const products = await productManager.getAllProducts({
//   const listaproductos = await productsModel.paginate(
//     {},
//     {
//       limit,
//       page,
//       sort,
//       //query,
//     }
//   );

//   res.render("products", { listaproductos });
//   console.log(listaproductos.docs);
//   console.log(listaproductos.hasNextPage);
//   console.log(listaproductos.hasPrevPage);
//   console.log(listaproductos.prevPage);
//   console.log(listaproductos.nextPage);
//   console.log(listaproductos.totalPages);
// });

// viewsRouter.get("/carts/:cid", async (req, res) => {
//   try {
//     const idcart = req.params.cid;
//     const cartById = await cartManager.getCartById(idcart);
//     if (cartById.success) {
//       console.log(cartById);
//       res.render("cart", { cart: cartById.cart });
//     } else {
//       res.status(404).send({ status: "error", message: cartById });
//     }
//   } catch (error) {
//     res.status(500).send({ status: "Error", error: error.message });
//   }
// });

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
