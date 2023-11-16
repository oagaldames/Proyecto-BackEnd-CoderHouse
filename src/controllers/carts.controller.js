import {
  getCartByIdService,
  addProductsToCartService,
  addCartService,
  updateProductQuantityService,
  updateProductsToCartService,
  deleteProductCartService,
  deleteAllProductsCartService,
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

    if (cart) {
      res.status(200).send({ status: "success", Result: cart });
    } else {
      res.status(400).send({ status: "Error", message: cart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
};

const updateProductQuantityController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const cart = await updateProductQuantityService(cid, pid, quantity);
    if (cart.success) {
      res.status(200).send({ status: "success", result: cart });
    } else {
      res.status(400).send({ status: "Error", message: cart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
};

const updateProductsToCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = req.body.products;

    const cart = await updateProductsToCartService(cid, products);

    if (cart.success) {
      res.status(200).send({ status: "success", result: cart });
    } else {
      res.status(400).send({ status: "Error", message: cart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
};

const deleteProductCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const deletedProductCart = await deleteProductCartService(cid, pid);
    if (deletedProductCart.success === true) {
      res.status(200).send({
        status: "success",
        message: `El producto con Id= ${pid}  se ha Eliminado correctamente.`,
      });
    } else {
      res.status(409).send({ error: deletedProductCart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
};

const deleteAllProductsCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const deletedProductsCart = await deleteAllProductsCartService(cid);
    if (deletedProductsCart.success === true) {
      res.status(200).send({
        status: "success",
        message: `Los Productos del carrito con Id= ${cid}  se han Eliminado correctamente.`,
      });
    } else {
      res.status(409).send({ error: deletedProductsCart });
    }
  } catch (error) {
    res.status(500).send({ status: "Error", error: error.message });
  }
};

export {
  addCartController,
  getCartByIdController,
  addProductsToCartController,
  updateProductQuantityController,
  updateProductsToCartController,
  deleteProductCartController,
  deleteAllProductsCartController,
};
