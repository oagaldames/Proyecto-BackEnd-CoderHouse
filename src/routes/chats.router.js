import express from "express";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("chat", {});
});

export { router as chatRouter };