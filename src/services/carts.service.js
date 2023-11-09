import CartManager from "../dao/dbManagers/carts.manager.js";
const cartManager = new CartManager();

const addCartService = async () => {
  const newCart = {
    products: [],
  };
  const newCartid = await cartManager.addCart(newCart);
  return newCartid;
};

const getCartByIdService = async (idcart) => {
  const cartById = await cartManager.getCartById(idcart);
  if (cartById) {
    return {
      success: true,
      cart: cartById,
    };
  } else {
    return {
      success: false,
    };
  }
};

const addProductsToCartService = async (product, iduser) => {};

export { getCartByIdService, addCartService, addProductsToCartService };
