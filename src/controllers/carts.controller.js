import {
  getCartByIdService,
  addProductsToCartService,
  addCartService,
} from "../services/carts.service.js";

const addCartController = async (req, res) => {
  try {
    const newCart = await addCartService();
    if (newCart) {
      res.status(201).send({ status: "success", Result: newCart });
    } else {
      res.status(400).send({ status: "error", message: newCart });
    }
  } catch (error) {
    res.status(500).send({ message: "Error", error: error.message });
  }
};

const getCartByIdController = async (req, res) => {
  try {
    const idcart = req.params.cid;
    const cartById = await getCartByIdService(idcart);
    if (cartById.success) {
      res.status(200).send({ status: "success", Result: cartById });
    } else {
      res.status(404).send({
        status: "error",
        mensaje: `No se encontro un Carrito con el Id ${idcart}`,
      });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
};

const addProductsToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = 1;

    const cart = await addProductsToCartService(cid, pid, quantity);

    if (cart.success) {
      res.status(200).send({ status: "success", Result: cart });
    } else {
      res.status(400).send({ status: "Error", message: cart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
};

export {
  addCartController,
  getCartByIdController,
  addProductsToCartController,
};
