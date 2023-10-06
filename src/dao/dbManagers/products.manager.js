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

  async getAllProducts({ limit = 10, page = 1, sort = null, query = {} }) {
    const options = {
      page: page,
      limit: limit,
      sort: {},
      customLabels: {
        docs: "payload",
        totalDocs: "totalProducts",
        page: "currentPage",
      },
    };
    try {
      if (sort === "asc" || sort === "desc") {
        options.sort = { price: sort === "asc" ? 1 : -1 };
      }

      const products = await productsModel.paginate(query, options);
      return {
        status: "success",
        payload: products.payload,
        totalProducts: products.totalProducts,
        totalPages: products.totalPages,
        currentPage: products.currentPage,
        hasNextPage: products.hasNextPage,
        hasPrevPage: products.hasPrevPage,
      };
    } catch (error) {
      return {
        status: "error",
        payload: products.payload, // Los documentos paginados
        totalProducts: products.totalProducts, // Total de productos
        totalPages: products.totalPages, // Total de páginas
        currentPage: products.currentPage, // Página actual
        hasNextPage: products.hasNextPage, // Si hay una página siguiente
        hasPrevPage: products.hasPrevPage, // Si hay una página previa
      };
    }
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
