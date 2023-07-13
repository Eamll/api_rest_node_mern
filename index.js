const { conexion } = require("./bd/conexion");
const express = require("express");
const cors = require("cors");
//Inicializar app
console.log("App de node arrancada");

//Conectar a la bd
conexion();

//Crear servidor Node
const app = express();
const puerto = 3900;
//Configurar cors
app.use(cors());

//Converir body a obj js
app.use(express.json()); //Recibir datos con content-type app/json
app.use(express.urlencoded({ extended: true })); //Form url-encoded

//RUTAS
const rutas_articulo = require("./rutas/articulo");

//Cargo las rutas
app.use("/api", rutas_articulo);


//Rutas prrueba hardcodeadas
app.get("/probando", (req, res) => {
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
});

app.get("/", (req, res) => {
    // console.log("Se ha ejecutado el endpoint probando");
    return res.status(200).send(
        `<h1>Empezando a crear una api con node js</h1>`
    );
});

//Crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto:" + puerto);
});