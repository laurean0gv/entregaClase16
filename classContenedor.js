//const fs = require ('fs');
const Knex = require('knex').default;

module.exports = class Contenedor {

    constructor(options) {
        this.options=options
        
        //armo la conexion
        const knex = Knex({
            client: 'mysql2',
            connection: this.options
        });

        //me fijo si existe la tabla, sino la creo
        const ejecutar = async () => {
        const existe=await knex.schema.hasTable("productos")
        if(!existe){
            await knex.schema.createTable("productos", (table) => {
                table.increments("id").primary().notNullable();
                table.string('title', 50);
                table.double('price');
                table.string('thumbnail');
            })
        }
        await knex.destroy();
        }
        ejecutar();
    }

    
    /**
     * 
     * @param {recibe json en formato srting} object 
     */
    async save(object) {
        try {
            const knex = Knex({
                client: 'mysql2',
                connection: this.options
            });

            //guardo el object y lo parseo a json
            let jsonSave=JSON.parse(object);

            //guardo el nuevo producto en la tabla
            const lastId =await knex('productos').insert(jsonSave);

            jsonSave= await knex.from('productos').where('id', lastId).select('*');
            await knex.destroy();

            return jsonSave;

        } catch (error) {
            console.log(`Error : ${error.message}`);
        }
        
    }

    async saveMsj(mensaje) {
        try {
            const knex = Knex({
                client: 'mysql2',
                connection: this.options
            });
            console.log(mensaje);
            //guardo el object y lo parseo a json
            let jsonSave=mensaje;
            

            //guardo el nuevo producto en la tabla
            const lastId =await knex('mensajes').insert(jsonSave);

            jsonSave= await knex.from('mensajes').where('id', lastId).select('*');
            await knex.destroy();

            return jsonSave;

        } catch (error) {
            console.log(`Error : ${error.message}`);
        }
        
    }

    
    /**
     * 
     * @param {recibe el id a buscar} string
     */
    async getById(idPedido) {
        let respuesta=null;
        try {
            const knex = Knex({
                client: 'mysql2',
                connection: this.options
            });

            //mando la query por el id pedido
            respuesta= await knex.from('productos').where('id', idPedido).select('*');
            await knex.destroy();

        } catch (error) {
            console.log(error.message);
        }

        //si ya recorrio todo el json y no lo encontro, devuelvo el mensaje diciendo que no se encontro
        if(respuesta==null){
            respuesta={error: 'producto no encontrado'};
        }
        
        return respuesta;
        
    };

    //leo el archivo, lo parseo a json y lo devuelvo
    async getAll() {
        try {
            const knex = Knex({
                client: 'mysql2',
                connection: this.options
            });

            //mando la query sin filtros
            let respuesta= await knex.from('productos').select('*');
            await knex.destroy();

            return respuesta;
        }
        catch(Error){
            console.log(Error.message);
        }

    }

    //leo el archivo, lo parseo a json y lo devuelvo
    async getAllMsj() {
        try {
            const knex = Knex({
                client: 'mysql2',
                connection: this.options
            });

            //mando la query sin filtros
            let respuesta= await knex.from('mensajes').select('nombre', 'mensaje').orderBy('id', 'desc');
            await knex.destroy();

            return respuesta;
        }
        catch(Error){
            console.log(Error.message);
        }

    }


    async deleteById(id) {

        try {
            const knex = Knex({
                client: 'mysql2',
                connection: this.options
            });

            //mando el delete para el id envido
            await knex.from('productos').where('id', id).delete();
            await knex.destroy();

            return (200);

            } catch (error) {
            console.log(error.message());
            }
        
    }


   async deleteAll() {
        try {
            const knex = Knex({
                client: 'mysql2',
                connection: this.options
            });

            //mando el delete sin where
            await knex.from('productos').delete();
            await knex.destroy();

            return (200);
            
        }
        catch(error){
            console.log(error.message);
        }
    }

    async putById(id, producto) {
        let respuesta={error: 'producto no encontrado'};
        try {
            const knex = Knex({
            client: 'mysql2',
            connection: this.options
        });

        //mando la query por el id pedido
        await knex.from('productos').where('id', id).update(producto);
        respuesta= await knex.from('productos').where('id', id).select('*');
        await knex.destroy();

        }
        catch(Error){
            res.send(Error.message);
        }
        return respuesta;
    }
    
}
