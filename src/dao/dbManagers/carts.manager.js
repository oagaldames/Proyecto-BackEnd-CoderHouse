import { cartsModel } from "../models/cart.model.js";
import ProductManager from "./products.manager.js";

const productManager = new ProductManager();

class CartManager {
  constructor() {
    this.carts = [];
  }

  async getCartById(id) {
    const cart = await cartsModel.findOne({ _id: id });
    if (cart) {
      return {
        success: true,
        cart: cart,
      };
    } else {
      return {
        success: false,
        mensaje: `No se encontro un Carrito con el Id ${id}`,
      };
    }
  }

  async addCart() {
    try {
      const newCart = {
        products: [],
      };
      const result = await cartsModel.create(newCart);
      return {
        success: true,
        message: "Carrito creado correctamente",
        cart: newCart,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async addProductsToCart(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);

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

      const indexProduct = cart.cart.products.findIndex(
        (item) => item.product === productId
      );

      if (indexProduct !== -1) {
        cart.cart.products[indexProduct].quantity++;
      } else {
        cart.cart.products.push({
          product: productId,
          quantity: quantity,
        });
      }
      const updatedCart = await cartsModel.updateOne(
        { _id: cartId },
        {
          products: cart.cart.products,
        }
      );
      try {
        return {
          success: true,
          message: "Carrito actualizado correctamente",
          cart: cart.cart,
        };
      } catch (error) {
        throw new Error("Producto no se pudo agregar");
      }
    } catch (error) {
      return error.message;
    }
  }
}

export default CartManager;
