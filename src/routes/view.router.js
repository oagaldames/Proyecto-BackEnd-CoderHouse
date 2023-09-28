import express from "express";
import { Router } from "express";
import ProductManager from "../dao/fileManagers/ProductManager.js";

const productManager = new ProductManager("./data/products.json");
const socketViewsRouter = Router();
const viewsRouter = (io) => {
  socketViewsRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
  });

  socketViewsRouter.get("/realtimeproducts", async (req, res) => {
    let products = await productManager.getProducts();
    io.on("connection", (socket) => {
      io.emit("dataUpdated", products);
      console.log("Cliente conectado");
      socket.on("updateProductList", async (message) => {
        products = await productManager.getProducts();
        io.emit("dataUpdated", products);
      });
    });
    res.render("realTimeProducts", { products });
  });

  return socketViewsRouter;
};

export default viewsRouter;
