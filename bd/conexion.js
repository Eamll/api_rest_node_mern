const mongoose = require("mongoose");

const conexion = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/my_blog");

        //Parametros dentro de objeto
        //useNewUrlParser: true
        //useUnifiedTOpology: true
        //useCreateIndex: true
        console.log("Coneccion exitosa a my_blog");
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la bd");
    }
}


module.exports = {
    conexion
}