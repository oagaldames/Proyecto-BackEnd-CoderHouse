import ProductManager from "../dao/dbManagers/products.manager.js";

const productManager = new ProductManager();

const getAllProductsService = async (limit, page, sort, category) => {
  let sortResult = {};
  if (sort === "asc" || sort === "desc") {
    sortResult = { price: sort === "asc" ? 1 : -1 };
  }

  const products = await productManager.getAllProducts(
    limit,
    page,
    sortResult,
    category
  );

  return products;
};

const getProductByIdService = async (id) => {
  const productById = await productManager.getProductById(id);
  return productById;
};

const existingProductService = async (code) => {
  //   const existingProduct = await productsModel.findOne({
  //     code,
  //   });
  const existingProduct = await productManager.getProductByCode(code);
  return existingProduct;
};
const addProductService = async (productData, pathThumbnail) => {
  const result = await productManager.addProduct({
    ...productData,
    thumbnail: pathThumbnail,
  });
  return result;
};

const updateProductService = async (idProduct, productData, pathThumbnail) => {
  const existId = await productManager.getProductById(idProduct);

  if (!existId) {
    throw new Error(`No se encontró un producto con el ID ${idProduct}`);
  }
  const existingProduct = await productManager.getProductByIdCode(
    productData.code,
    idProduct
  );

  if (existingProduct) {
    throw new Error("Ya existe el código de producto en otro producto");
  }
  const updatedProduct = await productManager.updateProduct(
    idProduct,
    productData,
    pathThumbnail
  );
  return updatedProduct;
};

const deleteProductService = async (id) => {
  const existId = await productManager.getProductById(id);

  if (existId) {
    const deletedProduct = await productManager.deleteProduct(id);
    return deletedProduct;
  } else {
    throw new Error(`No se encontro un Producto con el ID ${id}`);
  }
};

export {
  getAllProductsService,
  getProductByIdService,
  addProductService,
  existingProductService,
  updateProductService,
  deleteProductService,
};
