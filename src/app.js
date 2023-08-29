import ProductManager from "./models/ProductManager.js";
import express from "express";
const productManager = new ProductManager("./data/products.json");
const app = express();
const server = app.listen(8080, () => console.log("Escuchando en puerto 8080"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Devuelve todos los productos en el siguiente endpoint http://localhost:8080/products
//Devuelve solamente una cantidad de productos de acuerdo al limite ingresado en el siguiente endpoint http://localhost:8080/products?limit=5
app.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const products = await productManager.getProducts();
    if (limit) {
      const limitedProducts = products.slice(0, limit);
      res.send(limitedProducts);
    } else {
      res.send(products);
    }
  } catch (error) {
    res.send({ message: "Error interno del servidor" });
  }
});

//Se devuelve el producto de acuerdo al id ingresado en el siguiente endpoint http://localhost:8080/products/2
app.get("/products/:pid", async (req, res) => {
  try {
    const idProduct = parseInt(req.params.pid);

    const productById = await productManager.getProductById(idProduct);

    if (productById) {
      res.send(productById);
    } else {
      res.send({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.send({ message: "Error interno del servidor" });
  }
});
