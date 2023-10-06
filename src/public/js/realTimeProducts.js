const socket = io();

socket.on("dataUpdated", (products) => {
  const table = document.getElementById("productTable");
  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";
  products.forEach((products) => {
    const row = document.createElement("tr");
    const idCell = document.createElement("td");
    idCell.textContent = products.id;
    row.appendChild(idCell);
    const titleCell = document.createElement("td");
    titleCell.textContent = products.title;
    row.appendChild(titleCell);
    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = products.description;
    row.appendChild(descriptionCell);
    const codeCell = document.createElement("td");
    codeCell.textContent = products.code;
    row.appendChild(codeCell);
    const priceCell = document.createElement("td");
    priceCell.textContent = products.price;
    row.appendChild(priceCell);
    const stockCell = document.createElement("td");
    stockCell.textContent = products.stock;
    row.appendChild(stockCell);
    const categoryCell = document.createElement("td");
    categoryCell.textContent = products.category;
    row.appendChild(categoryCell);
    tbody.appendChild(row);
  });
});

const addProdForm = document.getElementById("addProductForm");
addProdForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {};
  for (const field of addProdForm.elements) {
    if (field.name) {
      formData[field.name] = field.value;

      if (field.name == "thumbnails")
        formData[field.name] = [...field.value.split(",")];

      if (field.name == "price" || field.name == "stock")
        formData[field.name] = parseFloat(field.value);
    }
  }

  fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) =>
      response.json().then((json) => {
        if (response.status !== 200 && response.status !== 201)
          throw new Error(json.message);
        return json;
      })
    )
    .then((data) => {
      console.log("API response:");
      socket.emit("updateProductList", "product submitted");
    })
    .catch((error) => {
      console.log("Error:", error.message);
      swal("Error", error.message, "error");
    });

  addProdForm.reset();
});

const delProdForm = document.getElementById("deleteProductForm");
delProdForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const pid = delProdForm.elements.productID.value ?? 0;

  fetch(`/api/products/${pid}`, {
    method: "DELETE",
  })
    .then((response) =>
      response.json().then((json) => {
        if (response.status !== 200 && response.status !== 201)
          throw new Error(json.message);
        return json;
      })
    )
    .then((data) => {
      console.log("API response:", data);
      socket.emit("updateProductList", "product deleted");
    })
    .catch((error) => {
      console.log("Error:", error.message);
      swal("Error", error.message, "error");
    });

  delProdForm.reset();
});
