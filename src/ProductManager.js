//en este archivo creamos la clase que tiene todas las funcioanlidades de como crear un us, como eliminarlo, esta inf se va a guardar en archivos objetos , ACA DEFINIMOS TODA LA FUNCIONALIDAD

import fs from 'fs' // para poder trabajar con archivos

//creo la clase
export default class ProductManager {
    constructor(path) { //cdo alguien creee una instancia, un objeto, tiene q pasar la ruta de donde se va a guardar esa inf que nos envien
        this.path = path
        this.products = [];

    }
    async saveFile() {
        //Guardo o sobreescribo el archivo
        await fs.promises.writeFile(this.path, JSON.stringify(this.products))
    }

    async readFile() {
        // Leer la inf del archivo 
        try {
            if (!fs.existsSync(this.path)) {
                console.log('Error: archivo no encontrado', this.path);
                return false;
            }

            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data) //la data que trae la prom la guardo en mi obj 
            console.log('info adhicionada con exito')
            return this.products
        } catch (error) {
            console.log('Error: ', error)
        }

        return false;
    }

    async addProduct({ title, description, price, thumbnail, code, stock }) {
        // validar que todos los campos existan
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los parametros son obligatorios')
            return false;
        }

        // validar que el producto no exista
        const found = this.products.find((product) => product.code == code);
        if (found) {
            console.log("El producto ya existe");
            return false;//para cortar la ejecucion
        }

        // si todos los param tiene valor y el prod no existe, lo agrega
        const id = this.products.length;
        this.products.push({
            'id': id,
            'title': title,
            'description': description,
            'price': price,
            'thumbnail': thumbnail,
            'code': code,
            'stock': stock
        });

        await this.saveFile() //actualizo el archivo

        console.log('Producto agregado');
        return true;
    }

    // consultar todos 
    async getProducts(query) {
        const { limit } = query
        const prods = await this.readFile();
        if(limit){
          return prods.splice(0,limit) // para obtener un pedazo de un arreglo
        }
        return prods
    }

    // consultar uno
    async getProductById(id) {
        const prods = await this.getProducts()
        if (!prods) {
            return false
        }
        const found = prods.find((product) => product.id == id)
        if (found) {
            return found;
        }
        console.log('Producto no encontrado')
        return false;
    }

    async updateProductById(id, { title, description, price, thumbnail, code, stock }) {
        await this.getProducts() // leo todos los prods del archivo y lo guardo en this.products

        //valido si existe el producto
        const found = this.products.find((product) => product.id == id)

        if (!found) { //si no existe
            return false;
        }

        //validar que los campos no esten vacios
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los parametros son obligatorios')
            return false;
        }

        //Actualizar el producto en el arreglo
        found.title = title;
        found.description = description;
        found.price = price;
        found.thumbnail = thumbnail;
        found.code = code;
        found.stock = stock;

        await this.saveFile() //actualizo el archivo
        console.log('Producto actualizado')
        return true;
    }

    async removeProductById(id) {
        await this.getProducts() // leo todos los prods del archivo y lo guardo en this.products

        //valido si existe el producto
        const found = this.products.find((product) => product.id == id)
        if (!found) { //si no existe
            return false;
        }

        // borro el elemento [id]
        this.products.splice(id, 1);//splice:modifica el [] original

        this.saveFile() //actualizo el archivo

        console.log('Producto ha sido eliminado con éxito')
        return true;
    }
}