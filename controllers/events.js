const { response } = require('express')
const Evento = require('../models/Evento')

const getEventos = async(req, resp = response) => {

    const eventos = await Evento.find().populate('user', 'name')

    resp.json({
        ok: true,
        eventos
    })
}

const crearEvento = async(req, resp = response) => {

    const evento = new Evento(req.body)

    try{
        evento.user = req.uid

        const eventoGuardado = await evento.save()

        resp.json({
            ok:true,
            evento: eventoGuardado
        })
    }catch(err){
        resp.status(500).json({
            ok:false,
            msg: 'hable con el administrador'
        })
    }

}

const editarEvento = async(req, resp = response) => {

    const eventoId = req.params.id
    const uid = req.uid
    
    try {
        const evento = await Evento.findById(eventoId)
        console.log(evento);
        if(!evento){
            return resp.status(404).json({
                ok:false,
                msg: 'Evento no existe por ese id'
            })
        }

        if(evento.user.toString() !==uid){
            return resp.status(401).json({
                ok:false,
                msg: 'No tiene privilegio de editar'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user:uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new:true})

        resp.json({
            ok:true,
            evento: eventoActualizado
        })

    } catch (error) {
        // console.log(error);
        resp.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

}

const eliminarEvento = async(req, resp = response) => {
    const eventoId = req.params.id
    const uid = req.uid
    
    try {
        const evento = await Evento.findById(eventoId)
        if(!evento){
            return resp.status(404).json({
                ok:false,
                msg: 'Evento no existe por ese id'
            })
        }

        if(evento.user.toString() !==uid){
            return resp.status(401).json({
                ok:false,
                msg: 'No tiene privilegio de eliminar'
            })
        }

        await Evento.findByIdAndDelete(eventoId)

        resp.json({ok:true})

    } catch (error) {
        resp.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    editarEvento,
    eliminarEvento
}