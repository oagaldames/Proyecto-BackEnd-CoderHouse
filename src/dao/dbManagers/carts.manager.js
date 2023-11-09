import { cartsModel } from "../models/cart.model.js";
import { productsModel } from "../models/product.model.js";
import ProductManager from "./products.manager.js";

const productManager = new ProductManager();

class CartManager {
  constructor() {
    this.carts = [];
  }

  async getCartById(id) {
    const cart = await cartsModel.findOne({ _id: id });
    return cart;
  }

  async addCart(newCart) {
    const result = await cartsModel.create(newCart);
    const cartId = result._id;
    return cartId;
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
        (item) => item.product.id === productId
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

  async deleteProductCart(cid, pid) {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        return {
          success: false,
          message: `No se encontró un carrito con el ID ${cid}`,
        };
      }
      const indexProduct = cart.cart.products.findIndex(
        (item) => item.product === pid
      );

      if (indexProduct !== -1) {
        cart.cart.products.splice(indexProduct, 1);
      } else {
        return {
          success: false,
          message: `No se encontró el producto con el ID ${pid} en el carrito `,
        };
      }
      const updatedCart = await cartsModel.updateOne(
        { _id: cid },
        {
          products: cart.cart.products,
        }
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
          message: "El Producto del Carrito no se pudo eliminar",
        };
      }
    } catch (error) {
      return error.message;
    }
  }

  async deleteAllProductsCart(cid) {
    try {
      const cart = await this.getCartById(cid);

      if (!cart) {
        return {
          success: false,
          message: `No se encontró un carrito con el ID ${cid}`,
        };
      }
      cart.cart.products.splice(0, cart.cart.products.length);
      const updatedCart = await cartsModel.updateOne(
        { _id: cid },
        {
          products: cart.cart.products,
        }
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
    } catch (error) {
      return error.message;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);

      if (!cart) {
        return {
          success: false,
          message: `No se encontró un carrito con el ID ${cartId}`,
        };
      }

      const indexProduct = cart.cart.products.findIndex(
        (item) => item.product === productId
      );

      if (indexProduct !== -1) {
        cart.cart.products[indexProduct].quantity = quantity;
      } else {
        return {
          success: false,
          message: `No se encontró el producto con el ID ${productId} en el carrito`,
        };
      }

      const updatedCart = await cartsModel.updateOne(
        { _id: cartId },
        { products: cart.cart.products }
      );
      console.log(updatedCart);
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async updateProductsToCart(cartId, products) {
    try {
      const cart = await this.getCartById(cartId);

      if (!cart) {
        return {
          success: false,
          message: `No se encontró un carrito con el ID ${cartId}`,
        };
      }

      for (const product of products) {
        const { product: productId, quantity } = product;

        const existingProduct = cart.cart.products.find(
          (item) => item.product === productId
        );

        if (existingProduct) {
          existingProduct.quantity = quantity;
        } else {
          cart.cart.products.push({
            product: productId,
            quantity: quantity,
          });
        }
      }

      const updatedCart = await cartsModel.updateOne(
        { _id: cartId },
        {
          products: cart.cart.products,
        }
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export default CartManager;
