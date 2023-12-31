import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

import handlebars from "express-handlebars";
import { productRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { usersRouter } from "./routes/users.router.js";

import viewsRouter from "./routes/view.router.js";
import mongoose from "mongoose";
import MessageManager from "./dao/dbManagers/messages.manager.js";
import MongoStore from "connect-mongo";
import SessionsRouter from "./routes/sessions.router.js";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const messagerManager = new MessageManager();
const sessionsRouter = new SessionsRouter();

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
  user;
}

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

initializePassport();
app.use(passport.initialize());

/** Rutas */
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);
