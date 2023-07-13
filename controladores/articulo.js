const fs = require("fs");
const { validarArticulo } = require("../helpers/validar");
const path = require("path");
const Articulo = require("../modelos/Articulo");


const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy prueba en articulos"
    });
}

const info = (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");
    return res.status(200).send(
        [
            {
                nombre: "Alexander",
                correo: "alexiselcapo@gmail.com"
            },
            {
                nombre: "Alexander",
                correo: "alexiselcapo@gmail.com"
            }
        ]
    );
};



const crear = (req, res) => {
    //Recoger los parametros por post a guardar
    let parametros = req.body;

    //Validar datos
    try {
        validarArticulo(parametros);

    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Faltan datos por enviar"
        });
    }
    //Crear el objeto a guardar
    const articulo = new Articulo(parametros);
    //Asignar valores a objeto basado en el modelo (manual o automatico)
    // articulo.titulo = parametros.titulo;
    //Guardar el articulo en la base de datos
    articulo.save((error, articuloGuardado) => {
        if (error || !articuloGuardado) {
            return res.status(400).json({
                status: "Error",
                mensaje: "No se ha guardado el articulo"
            });
        }
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "articulo guardado con exito"
        });

    });
    //Devolver el resultado


}

const listar = (req, res) => {
    let consulta = Articulo.find({});
    if (req.params.ultimos) {
        consulta.limit(3);
    }

    consulta.sort({ fecha: -1 })
        .exec((error, articulos) => {
            if (error || !articulos) {
                return res.status(400).json({
                    status: "Error",
                    mensaje: "No se han encontrado articulos"
                });
            }

            return res.status(200).send({
                status: "success",
                parametro: req.params.ultimos,
                articulos
            });
        });
}

const uno = (req, res) => {
    //Recoger una id por la url
    let id = req.params.id;
    //Buscar el articulo
    Articulo.findById(id, (error, articulo) => {
        //Si no existe devolver error
        if (error || !articulo) {
            return res.status(400).json({
                status: "Error",
                mensaje: "No se ha encontrado el articulo"
            });
        }
        //Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        });
    });

}

const borrar = (req, res) => {

    let id = req.params.id;
    Articulo.findOneAndDelete({ _id: id }, (error, articuloBorrado) => {

        if (error || !articuloBorrado) {
            return res.status(400).json({
                status: "Error",
                mensaje: "Error al borrar el articulo"
            });
        }
        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "metodo borrar"
        });
    });


}



const editar = (req, res) => {
    //Recoger articulo a editar
    let id = req.params.id;
    let parametros = req.body;
    try {
        validarArticulo(parametros);

    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Faltan datos por enviar"
        });
    }

    //Buscar y actualizar el articulo

    Articulo.findOneAndUpdate({ _id: id }, req.body, { new: true }, (error, articuloActualizado) => {
        if (error || !articuloActualizado) {
            return res.status(400).json({
                status: "Error",
                mensaje: "Error al actualizar"
            });
        }

        //Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado,
        });

    });
}

const subirImagen = (req, res) => {

    //Configurar multer en articulo rutas

    //Recoger el fichero de imagen subido
    if (!req.file && !req.files) {
        return res.status(400).json({
            status: "error",
            mensaje: "Peticion invalida"
        })
    }
    //Nombre del archivo
    let nombreArchivo = req.file.originalname;
    //Extension del archivo
    let archivo_split = nombreArchivo.split("\.");
    let archivo_extension = archivo_split[1];
    //Comprobar extension correcto
    if (archivo_extension != "png" && archivo_extension != "jpg" && archivo_extension != "jpeg" && archivo_extension != "gif") {
        //Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Archivo invalido"
            })
        });
    } else {
        //Actualizar articulo
        //Recoger articulo a editar
        let id = req.params.id;

        //Buscar y actualizar el articulo

        Articulo.findOneAndUpdate({ _id: id }, { imagen: req.file.filename }, { new: true }, (error, articuloActualizado) => {
            if (error || !articuloActualizado) {
                return res.status(400).json({
                    status: "Error",
                    mensaje: "Error al actualizar"
                });
            }

            //Devolver respuesta
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                fichero: req.file,
                mensaje: "metodo actualizar"
            });
        });

    }
}

const getImagen = (req, res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                status: "Error",
                mensaje: "La imagen no existe",
                existe,
                fichero,
                ruta_fisica
            });
        }
    });
}

const buscar = (req, res) => {
    //Sacar el string de busqueda
    let busqueda = req.params.busqueda;
    //Find OR
    Articulo.find({
        "$or": [
            { "titulo": { "$regex": busqueda, "$options": "i" } },
            { "contenido": { "$regex": busqueda, "$options": "i" } },

        ]
    }).sort({ fecha: -1 })
        .exec((error, articulosEncontrados) => {
            if (error || !articulosEncontrados || articulosEncontrados.length <= 0) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos"
                });
            }

            return res.status(200).json({
                status: "success",
                articulos: articulosEncontrados
            });
        })
    //Orden

    //Ejecutar consulta

    //Devolver resultado
}

module.exports = {
    prueba,
    info,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subirImagen,
    getImagen,
    buscar
}