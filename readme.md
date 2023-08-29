# Desafio entregable Servidor con Express

## Alumno: Omar A. Galdames

# El archivo products.json con 10 productos se encuentra en src/data

# La clase ProductManager se encuentra en src/models

# Las rutas estan definidas en el app.js y los metodos de la clase ProductManager se llaman desde aqui

# Para correrlo, ejecutar nodemon app.js para que levante el servidor local en el puerto 8080

## Test

# Se corroborará que el servidor esté corriendo en el puerto 8080.

# Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.

# Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos o los que se indiquen en el query param.

# Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2. o el que se indique en el req.params

# Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.
