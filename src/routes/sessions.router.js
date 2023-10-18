import { Router } from "express";
import passport from "passport";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "fail-register" }),
  async (req, res) => {
    res.send({ status: "success", message: "user registered" });
  }
);

router.get("/fail-register", async (req, res) => {
  res.status(500).send({ status: "error", message: "register fail" });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "fail-login" }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(401)
        .send({ status: "error", message: "incorrect credentials" });

    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      rol: req.user.rol,
      age: req.user.age,
    };

    res.send({ status: "success", message: "Login success" });
  }
);

router.get("/fail-login", async (req, res) => {
  res.status(500).send({ status: "error", message: "login fail" });
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
