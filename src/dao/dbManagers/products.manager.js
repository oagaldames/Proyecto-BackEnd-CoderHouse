import { productsModel } from "../models/product.model.js";

class ProductManager {
  constructor() {
    this.products = [];
  }

  async getProducts() {
    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (error) {
      return error.message;
    }
  }

  async getAllProducts(limit, page, sort, category) {
    console.log(sort);
    const options = {
      page: page,
      limit: limit,
      sort: sort,
      customLabels: {
        docs: "payload",
        totalDocs: "totalProducts",
        page: "currentPage",
      },
    };

    let products = {};

    if (Object.keys(category).length === 0) {
      products = await productsModel.paginate({}, options);
    } else {
      products = await productsModel.paginate({ category }, options);
    }

    return {
      status: "success",
      payload: products.payload,
      totalProducts: products.totalProducts,
      totalPages: products.totalPages,
      currentPage: products.currentPage,
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
    };
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
  async getProductByIdCode(code, id) {
    const existingProduct = await productsModel.findOne({
      code: code,
      _id: { $ne: id },
    });
    return existingProduct;
  }
  async updateProduct(id, dataUpdate, pathFile) {
    try {
      // const existId = await productsModel.findOne({ _id: id });

      // if (!existId) {
      //   throw new Error(`No se encontró un producto con el ID ${id}`);
      // }
      // const existingProduct = await productsModel.findOne({
      //   code: dataUpdate.code,
      //   _id: { $ne: id },
      // });

      // if (existingProduct) {
      //   throw new Error("Ya existe el código de producto en otro producto");
      // }

      const updatedProduct = await productsModel.updateOne(
        { _id: id },
        {
          ...dataUpdate,
          $push: { thumbnail: { $each: pathFile } },
        }
      );

      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    const result = await productsModel.deleteOne({ _id: id });
    return result;
  }
}

export default ProductManager;
