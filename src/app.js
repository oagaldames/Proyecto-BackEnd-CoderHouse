import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

import handlebars from "express-handlebars";
import { productRouter } from "./routes/products.js";
import { cartsRouter } from "./routes/carts.js";
import viewsRouter from "./routes/view.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// Iniciar el servidor en el puerto 8080
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Rutas */
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter(socketServer));
