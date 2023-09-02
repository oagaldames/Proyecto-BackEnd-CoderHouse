import fs from "fs/promises";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.productIdCounter = 1;
  }

  async loadFileProducts() {
    const dataProducts = await fs.readFile(this.path, "utf-8");
    try {
      this.products = JSON.parse(dataProducts);
      this.productIdCounter = this.products.length + 1;
    } catch (error) {
      return error.message;
    }
  }

  async saveFileProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.products), "utf-8");
  }

  async addProduct(product) {
    try {
      await this.loadFileProducts();
      try {
        if (
          !product.title ||
          !product.description ||
          !product.code ||
          !product.price ||
          !product.stock ||
          !product.category
        ) {
          throw new Error("Todos los campos son obligatorios.");
        }

        const existingProduct = this.products.find(
          (p) => p.code === product.code
        );
        if (existingProduct) {
          throw new Error("Ya existe el producto.");
        }

        const newProduct = {
          id: this.productIdCounter,
          status: true,
          ...product,
        };
        this.products.push(newProduct);
        this.productIdCounter++;
        await this.saveFileProducts();
        return newProduct;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }

  async getProducts() {
    await this.loadFileProducts();
    try {
      return this.products;
    } catch (error) {
      return error.message;
    }
  }

  async getProductById(id) {
    await this.loadFileProducts();
    try {
      console.log(id);
      const product = this.products.find((p) => p.id === id);
      if (!product) {
        return null;
      }
      return product;
    } catch (error) {
      return null;
    }
  }

  async updateProduct(id, dataUpdate) {
    try {
      await this.loadFileProducts();
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
          console.log(`No se encontro un Producto con el ID ${id}`);
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
