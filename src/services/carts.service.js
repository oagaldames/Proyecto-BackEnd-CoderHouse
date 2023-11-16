import CartManager from "../dao/dbManagers/carts.manager.js";
import ProductManager from "../dao/dbManagers/products.manager.js";

const cartManager = new CartManager();
const productManager = new ProductManager();

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

const addProductsToCartService = async (cartId, productId, quantity) => {
  console.log(cartId, productId, quantity);
  const cart = await cartManager.getCartById(cartId);
  console.log(cart);
  if (!cart) {
    return {
      success: false,
      message: `No se encontró un carrito con el ID ${cartId}`,
    };
  }
  const product = await productManager.getProductById(productId);

  if (!product) {
    return {
      success: false,
      message: "El producto que se quiere agregar no existe",
    };
  }
  console.log(cart.products);
  const indexProduct = cart.products.findIndex(
    (item) => item.product.id === productId
  );

  if (indexProduct !== -1) {
    cart.products[indexProduct].quantity++;
  } else {
    cart.products.push({
      product: productId,
      quantity: quantity,
    });
  }
  const updateCart = await cartManager.addProductsToCart(
    cartId,
    productId,
    quantity
  );
  return updateCart;
};

const updateProductQuantityService = async (cartId, productId, quantity) => {
  const cart = await cartManager.getCartById(cartId);
  if (!cart) {
    return {
      success: false,
      message: `No se encontró un carrito con el ID ${cartId}`,
    };
  }
  const indexProduct = cart.products.findIndex(
    (item) => item.product === productId
  );
  if (indexProduct !== -1) {
    cart.products[indexProduct].quantity = quantity;
  } else {
    return {
      success: false,
      message: `No se encontró el producto con el ID ${productId} en el carrito`,
    };
  }
  const updatedCart = await cartManager.updateProductQuantity(cartId, cart);

  if (updatedCart) {
    return {
      success: true,
      message: `Se actualizó la cantidad del producto con el ID ${productId} correctamente`,
      cart,
    };
  } else {
    return {
      success: false,
      message: `No se pudo actualizar la cantidad del producto con el ID ${productId}`,
    };
  }
};

const updateProductsToCartService = async (cid, products) => {
  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    return {
      success: false,
      message: `No se encontró un carrito con el ID ${cid}`,
    };
  }
  for (const product of products) {
    const { product: productId, quantity } = product;

    const existingProduct = cart.products.find(
      (item) => item.product === productId
    );

    if (existingProduct) {
      existingProduct.quantity = quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity,
      });
    }
  }
  const updatedCart = await cartManager.updateProductsToCart(
    cid,
    cart.products
  );
  if (updatedCart) {
    return {
      success: true,
      message: "Carrito actualizado correctamente",
      cart: cart.cart,
    };
  } else {
    return {
      success: false,
      message: "No se pudo actualizar el carrito",
    };
  }
};

const deleteProductCartService = async (cid, pid) => {
  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    return {
      success: false,
      message: `No se encontró un carrito con el ID ${cid}`,
    };
  }
  const indexProduct = cart.products.findIndex((item) => item.product === pid);

  if (indexProduct !== -1) {
    cart.products.splice(indexProduct, 1);
  } else {
    return {
      success: false,
      message: `No se encontró el producto con el ID ${pid} en el carrito `,
    };
  }
  const updatedCart = await cartManager.deleteProductCart(cid, cart.products);
  if (updatedCart) {
    return {
      success: true,
      message: "Carrito actualizado correctamente",
      cart: cart.cart,
    };
  } else {
    return {
      success: false,
      message: "El Producto del Carrito no se pudo eliminar",
    };
  }
};

const deleteAllProductsCartService = async (cid) => {
  const cart = await cartManager.getCartById(cid);

  if (!cart) {
    return {
      success: false,
      message: `No se encontró un carrito con el ID ${cid}`,
    };
  }
  cart.products.splice(0, cart.products.length);

  const updatedCart = await cartManager.deleteAllProductsCart(
    cid,
    cart.products
  );

  if (updatedCart) {
    return {
      success: true,
      message: "Carrito actualizado correctamente",
      cart: cart.cart,
    };
  } else {
    return {
      success: false,
      message: "No se pudo actualizar el carrito en la base de datos",
    };
  }
};

export {
  getCartByIdService,
  addCartService,
  addProductsToCartService,
  updateProductQuantityService,
  updateProductsToCartService,
  deleteProductCartService,
  deleteAllProductsCartService,
};
