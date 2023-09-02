import express from "express";

import { productRouter } from "./routes/products.js";
const app = express();

// Iniciar el servidor en el puerto 8080
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Monta las rutas de productos en la ruta /api/products
app.use("/api/products", productRouter);
