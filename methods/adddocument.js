const express = require("express");
require("../db/config");

const documentos = require("../db/documentos")
const parents = require("../db/parents")
const bautismo = require("../db/bautismo")
const confirmacion = require("../db/confirmacion")
const matrimonio = require("../db/matrimonio")

const adddocument = new express.Router();

const usuarios = require("../db/usuarios")
const jwt = require('jsonwebtoken');

adddocument.post("/adddocument", async (req,res) =>{
    const data = req.body
    var docs = "";

    const token = req.header('x-token');
    const {uuid} = jwt.verify(
        token,
        process.env.SECRET_JWT_SEED
    );
    const usuario = await usuarios.findById(uuid)

    if (usuario.rol == "NINGUNO"){
        return res.status(200).json({
            status: false,
            msg: "no perms"
        });
    }

    if (data.Documento.name.length !== 0 && data.Documento.lastname.length !== 0)
    {
        docs = await documentos.find({nameE: data.Documento.nameE, lastnameE: data.Documento.lastnameE, rut: data.Documento.rut});
        if (docs.length > 0)
        {
            return res.status(200).json({
                status: false,
                msg: "document already exists"
            });
        } else {
            let p_parent = "" ;
            let d_bautismo = "";
            let d_confirmacion = "";
            let d_matrimonio = "";

            if(data.A_parent){
                p_parent = new parents(data.parent_Data)
                await p_parent.save() 
            }
            if(data.A_bautismo){
                d_bautismo = new bautismo(data.Bautismo)
                await d_bautismo.save() 
            }
            if(data.A_confirmacion){
                d_confirmacion = new confirmacion(data.Confirmacion)
                await d_confirmacion.save() 
            }
            if(data.A_matrimonio){
                d_matrimonio = new matrimonio(data.Matrimonio)
                await d_matrimonio.save() 
            }

            let b_nombre = data.Documento.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            let b_apellido = data.Documento.lastname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")


            let datos = {
                ...data.Documento,
                inscr_Date: data.Bautismo.b_date,
                nameE: b_nombre,
                lastnameE: b_apellido,
                parent_Data:{
                    p_id: (p_parent == "" ? "":p_parent._id.toString())
                },
                Bautismo:{
                    b_id: (d_bautismo == "" ? "":d_bautismo._id.toString())
                },
                Confirmacion:{
                    c_id: (d_confirmacion == "" ? "":d_confirmacion._id.toString())
                },
                Matrimonio:{
                    m_id: (d_matrimonio == "" ? "":d_matrimonio._id.toString())
                },
            }

            let documento = new documentos(datos)
            await documento.save() 

            return res.status(200).json({
                status: true
            });
        }
    } else {
        return res.status(200).json({
            status: false,
            msg: "name and lastname cant be blank"
        });
    }
    
})
module.exports = adddocument;