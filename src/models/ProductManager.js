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
      this.productsIdCounter = 1;
      const dataProducts = await fs.writeFile(this.path, "utf-8");
    }
  }

  async saveFileProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products), "utf-8");
  }

  async addProduct(product, pathFile) {
    try {
      await this.loadFileProducts();

      if (
        !product.title ||
        !product.description ||
        !product.code ||
        !product.price ||
        !product.stock ||
        !product.category
      ) {
        throw new Error("Faltan campos son obligatorios.");
      }

      const existingProduct = this.products.find(
        (p) => p.code === product.code
      );
      if (existingProduct) {
        throw new Error("Ya existe el producto.");
      }
      const newProduct = {
        thumbnail: pathFile,
        ...product,
        id: this.productIdCounter,
        status: true,
      };
      this.products.push(newProduct);
      this.productIdCounter++;
      await this.saveFileProducts();
      return newProduct;
    } catch (error) {
      return error.message;
    }
  }

  async getProducts() {
    try {
      await this.loadFileProducts();

      return this.products;
    } catch (error) {
      return error.message;
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
      return null;
    }
  }

  async updateProduct(id, dataUpdate, pathFile) {
    try {
      await this.loadFileProducts();
      try {
        const productIndex = this.products.findIndex(
          (product) => product.id === id
        );
        if (productIndex !== -1) {
          const existingProduct = this.products.find(
            (p) => p.code === dataUpdate.code
          );
          if (existingProduct && existingProduct.id !== id) {
            throw new Error("Ya existe el codigo de producto en otro producto");
          } else {
          }
          this.products[productIndex] = {
            ...this.products[productIndex],
            ...dataUpdate,
            id: id,
            thumbnail: [...this.products[productIndex].thumbnail, ...pathFile],
          };
          await this.saveFileProducts();
          try {
            return true;
          } catch (error) {
            throw new Error("No se ha podido actualizar el producto");
          }
        } else {
          throw new Error(`No se encontro un Producto con el Id ${id}`);
        }
      } catch (error) {
        return error.message;
      }
    } catch (error) {
      return error.message;
    }
  }

  async deleteProduct(id) {
    try {
      await this.loadFileProducts();
      try {
        const productIndex = this.products.findIndex(
          (product) => product.id === id
        );
        if (productIndex !== -1) {
          const deleteProduct = this.products.splice(productIndex, 1)[0];
          await this.saveFileProducts();
          try {
            return true;
          } catch (error) {
            return error.message;
          }
        } else {
          throw new Error(`No se encontro un Producto con el ID ${id}`);
        }
      } catch (error) {
        return error.message;
      }
    } catch (error) {
      return error.message;
    }
  }
}

export default ProductManager;
