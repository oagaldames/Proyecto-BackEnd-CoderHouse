import { Router } from "express";
import usersModel from "../dao/models/users.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await usersModel.findOne({ email });

    if (exists) {
      return res
        .status(400)
        .send({ status: "error", message: "El usuario ya existe" });
    }

    await usersModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
      rol: "usuario",
    });

    res
      .status(201)
      .send({ status: "success", message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findOne({ email, password });

    if (!user) {
      return res
        .status(400)
        .send({ status: "error", message: "Credenciales incorrectas" });
    }

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      rol: user.rol,
      age: user.age,
    };

    res.send({ status: "success", message: "login Existoso" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      return res
        .status(500)
        .send({ status: "error", error: "Falla en logout" });
    res.redirect("/");
  });
});

export default router;
