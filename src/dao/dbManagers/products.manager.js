import { productsModel } from "../models/product.model.js";

class ProductManager {
  constructor() {
    this.products = [];
  }

  async getAllProducts(limit) {
    let query = productsModel.find().lean();
    if (limit) {
      query = query.limit(limit);
    }
    const products = await query.exec();
    return products;
  }

  async getProductById(id) {
    const product = await productsModel.findOne({ _id: id });
    if (product) {
      return product;
    }
    throw new Error("No se encontró el producto con el ID especificado.");
  }

  async getProductByCode(code) {
    const product = await productsModel.findOne({ code });
    return product;
  }

  async addProduct(product, pathFile) {
    try {
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

      const existingProduct = await productsModel.findOne({
        code: product.code,
      });
      if (existingProduct) {
        throw new Error("Ya existe el producto.");
      }

      const result = await productsModel.create({
        thumbnail: pathFile,
        ...product,
        status: true,
      });

      return result;
    } catch (error) {
      return error.message;
    }
  }

  async updateProduct(id, dataUpdate, pathFile) {
    try {
      const existId = await productsModel.findOne({ _id: id });

      if (!existId) {
        throw new Error(`No se encontró un producto con el ID ${id}`);
      }
      const existingProduct = await productsModel.findOne({
        code: dataUpdate.code,
        _id: { $ne: id },
      });

      if (existingProduct) {
        throw new Error("Ya existe el código de producto en otro producto");
      }
      const updatedProduct = await productsModel.updateOne(
        { _id: id },
        {
          ...dataUpdate,
          $push: { thumbnail: pathFile },
        }
      );

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const existId = await productsModel.findOne({ _id: id });

      if (existId) {
        const result = await productsModel.deleteOne({ _id: id });
        return result;
      } else {
        throw new Error(`No se encontro un Producto con el ID ${id}`);
      }
    } catch (error) {
      return error.message;
    }
  }
}

export default ProductManager;
