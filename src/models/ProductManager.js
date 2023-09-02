import fs from "fs/promises";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.productIdCounter = 1;
  }

  async loadFileProducts() {
    try {
      const dataProducts = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(dataProducts);
      this.productIdCounter = this.products.length + 1;
    } catch (error) {
      this.products = [];
    }
  }

  async saveFileProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products), "utf-8");
  }

  async addProduct(product) {
    try {
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock
      ) {
        throw new Error("Todos los campos son obligatorios.");
      }

      const existingProduct = this.products.find(
        (p) => p.code === product.code
      );
      if (existingProduct) {
        throw new Error("Ya existe el producto");
      }

      const newProduct = {
        id: this.productIdCounter,
        ...product,
      };

      this.products.push(newProduct);
      this.productIdCounter++;
      await this.saveFileProducts();
      console.log("Se agrego el producto:", newProduct);
    } catch (error) {
      console.log(error.message);
    }
  }

  async getProducts() {
    try {
      await this.loadFileProducts();
      return this.products;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  async getProductById(id) {
    try {
      await this.loadFileProducts();
      const product = this.products.find((p) => p.id === id);
      if (!product) {
        return null;
      }
      return product;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async updateFileProducts(id, dataUpdate) {
    try {
      const productIndex = this.products.findIndex(
        (product) => product.id === id
      );
      if (productIndex !== -1) {
        this.products[productIndex] = {
          ...this.products[productIndex],
          ...dataUpdate,
          id: id,
        };
        await this.saveFileProducts();
        console.log("Producto Actualizado :", this.products[productIndex]);
      } else {
        console.log(`No se encontro un Producto con el ID ${id}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteFileProducts(id) {
    try {
      const productIndex = this.products.findIndex(
        (product) => product.id === id
      );
      if (productIndex !== -1) {
        const deleteProduct = this.products.splice(productIndex, 1)[0];
        await this.saveFileProducts();
        console.log("Producto Eliminado:", deleteProduct);
      } else {
        console.log(`No se encontro un Producto con el ID ${id}`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

export default ProductManager;
