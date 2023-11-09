import {
  getAllProductsService,
  getProductByIdService,
  addProductService,
  existingProductService,
  updateProductService,
  deleteProductService,
} from "../services/products.service.js";

const getAllProductController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const category = req.query.category || {};
    const products = await getAllProductsService(limit, page, sort, category);
    res.send({ status: "success", payload: products });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getProductIdController = async (req, res) => {
  try {
    const idProduct = req.params.pid;
    const productById = await getProductByIdService(idProduct);
    if (productById) {
      res.status(200).send({ status: "success", productById });
    } else {
      res.status(404).send({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const addProductController = async (req, res, next) => {
  try {
    let pathThumbnail = [];
    if (req.files) {
      const arrayFiles = req.files;
      pathThumbnail = arrayFiles.map((item) => item.path);
    } else {
      pathThumbnail = [];
    }
    const productData = req.body;

    if (
      !productData.title ||
      !productData.description ||
      !productData.code ||
      !productData.price ||
      !productData.stock ||
      !productData.category
    ) {
      throw new Error("Faltan campos son obligatorios.");
    }

    const existingProduct = await existingProductService(productData.code);
    if (existingProduct) {
      throw new Error("Ya existe el producto.");
    }

    const result = await addProductService({
      ...productData,
      thumbnail: pathThumbnail,
    });

    res.status(201).send({
      message: "Producto creado correctamente",
      product: result,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

const updateProductController = async (req, res, next) => {
  let pathThumbnail = [];
  try {
    if (req.files) {
      const arrayFiles = req.files;
      pathThumbnail = arrayFiles.map((item) => item.path);
    } else {
      pathThumbnail = [];
    }
    const idProduct = req.params.pid;
    const productData = req.body;
    const updatedProduct = await updateProductService(
      idProduct,
      productData,
      pathThumbnail
    );
    if (updatedProduct) {
      res.status(200).send({
        status: "success",
        message: `El producto con Id= ${idProduct}  se ha Modificado correctamente.`,
        updatedProduct,
      });
    } else {
      res.status(400).json({ error: updatedProduct });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const idProduct = req.params.pid;
    const deletedProduct = await deleteProductService(idProduct);

    if (deletedProduct === true) {
      res.status(200).send({
        status: "success",
        message: `El producto con Id= ${idProduct}  se ha Eliminado correctamente.`,
      });
    } else {
      res.status(409).send({ error: deletedProduct });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error interno del servidor", error: error.message });
  }
};

export {
  getAllProductController,
  getProductIdController,
  addProductController,
  updateProductController,
  deleteProductController,
};
