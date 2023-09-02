import fs from "fs/promises";

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    this.carts = [];
    this.cartIdCounter = 1;
  }

  async loadFileCarts() {
    try {
      const dataCarts = await fs.readFile(this.path, "utf-8");

      this.carts = JSON.parse(dataCarts);
      this.cartIdCounter = this.carts.length + 1;
    } catch (error) {
      this.carts = [];
      this.cartIdCounter = 1;
      const dataCarts = await fs.writeFile(this.path, "utf-8");
    }
  }

  async saveCart() {
    await fs.writeFile(this.path, JSON.stringify(this.carts), "utf-8");
  }

  async addCart() {
    //try {
    await this.loadFileCarts();
    try {
      console.log("loadFileCarts");
      const newCart = {
        id: this.cartIdCounter,
        products: [],
      };
      this.carts.push(newCart);
      console.log(newCart);
      this.cartIdCounter++;
      await this.saveCart();
      return {
        success: true,
        message: "Carrito creado correctamente",
        cart: newCart,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
    //} catch (error) {
    //  throw error;
    //}
  }

  async getCarts() {
    await this.loadFileCarts();
    try {
      return this.carts;
    } catch (error) {
      return error.message;
    }
  }

  async getCartById(id) {
    await this.loadFileCarts();
    try {
      const cart = this.carts.find((c) => c.id === id);
      if (!cart) {
        return null;
      }
      return cart;
    } catch (error) {
      return null;
    }
  }
}
export default CartManager;
