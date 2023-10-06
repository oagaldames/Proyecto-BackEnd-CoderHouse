import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

import handlebars from "express-handlebars";
import { productRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import viewsRouter from "./routes/view.router.js";
import mongoose from "mongoose";
import MessageManager from "./dao/dbManagers/messages.manager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const messagerManager = new MessageManager();

// Iniciar el servidor en el puerto 8080
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

try {
  await mongoose.connect(
    "mongodb+srv://ogaldames67:Fena2920@cluster0.lhnijnj.mongodb.net/ecommerce?retryWrites=true&w=majority"
  );
  console.log("DB connected");
} catch (error) {
  console.log(error.message);
}

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
//app.use("/products", viewsRouter(socketServer));
app.use("/", viewsRouter);

let messages = [];
socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("authenticate", () => {
    socket.emit("messageLogs", messages);
  });
  try {
    socket.on("message", async (data) => {
      messages.push(data);
      socketServer.emit("messageLogs", messages);
      console.log(data);

      const result = await messagerManager.saveMessage(data);
      console.log(result);
    });
  } catch (error) {
    console.log("Error al guardar mensaje");
  }
  socket.broadcast.emit("userConnected", { user: "Nuevo usuario conectado" });
});
