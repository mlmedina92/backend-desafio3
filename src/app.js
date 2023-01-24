import express from 'express';
import ProductManager from './ProductManager.js'

const app = express()

//Para crear servidores tenemos q decirle q use dos metodos de express
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Instancio la clase:
const pm = new ProductManager('./files/products.json') // le paso la RUTA con la que vamos a trabajar (PATH)

//  Creo las distintas rutas:
//Ruta para buscar todos los productos:
app.get('/products', async(req, res) => { 

     const prods = await pm.getProducts(req.query)//lo que este desp del ? es query. se pueden concatenar con &
     res.json({prods})
})


//Ruta para bucar un prod en particular:
app.get('/products/:idProduct', async(req, res) => {
     const {idProduct} = req.params
      const product = await pm.getProductById(parseInt(idProduct))
     res.json({product})
 })


app.listen(8081, () => {
    console.log('escuchando puerto 8081');
})
