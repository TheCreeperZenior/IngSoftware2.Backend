const express = require("express");
const cors = require("cors");
require('dotenv').config()

const{ObjetoId} = require("mongoose")
const app = express();
const Document = require('./db/documentos')



app.use(express.json());
app.use(cors());

//  Consulta para registrar usuarios nuevos
app.use(require("./methods/register"));

// Consulta para obtener los usuarios
app.use(require("./methods/getuser"));

//borrar documentos
app.use(require("./methods/deletedocument"))

//para obtener los documentos necesarios
app.use(require("./methods/getdocument"))

//para subir nuevos documentos
app.use(require("./methods/adddocument"))

//para actualizar documetos 
app.use(require("./methods/editdocument"))

// consulta para borrar usuarios
app.use(require("./methods/deleteuser"));

// consulta para loguearse
app.use(require("./methods/login"));
app.use(require("./methods/renewJWT"));

console.log("app is online at port "+process.env.SERVER_PORT)
app.listen(process.env.SERVER_PORT);