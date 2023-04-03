import { gql } from "apollo-server";

export const typeDefs = gql`
    type Persona {
        _id: String!
        nombre: String!
        apellido1: String!
        apellido2: String!
        telefono: String!
        contrasena: String!
        token: String!
        correo: String!
        permisos: String!
        horasSemanales: Float!
        diasHabiles: Float!
    }

    type Vacaciones {
        _id: String!
        persona: String!
        correoPersona: String!
        diasVacas: [String!]
        estado: String!
    }

    type Fichaje {
        _id: String!
        persona: String!
        fecha: String!
        entradasSalidas: String!
        comentario: String!
    }

    type TrabajoReg {
        _id: String!
        persona: String!
        fecha: String!
        tiempo: Float
        trabajoRealizado: String
        Fdesde: String
        comentario: String
    }

    type Mes {
        meses: String!
        dias: [String!]
    }

    type Query{
        getVacacionesUsu: [Vacaciones]
        getVacacionesAdmin: [Vacaciones]
        getFichaje: [Fichaje]
        getTrabajoReg: [TrabajoReg]
        getUser: Persona
        getMes(mes: String!): Mes
    }

    type Mutation{
        logIn(correo: String!, contrasena: String!): Persona!
        logOut: Persona!

        masMeses: Int

        createUser(nombre: String, apellido1: String, apellido2: String, telefono: String, contrasena: String, correo: String, horasSemanales: Float, diasHabiles: Float, permisos: String): Persona

        setTrabajoReg(tiempo: Float, trabajoRealizado: String, Fdesde: String, comentario: String): TrabajoReg
        editTrabajoReg(id: String, tiempo: Float, trabajoRealizado: String, Fdesde: String, comentario: String): TrabajoReg
        deleteTrabajoReg(id: String): TrabajoReg

        setFichaje(hora: String, comentario: String): Fichaje
        editFichaje(id: String, hora: String, comentario: String): Fichaje
        deleteFichaje(id: String): Fichaje

        setVacaciones(Fdesde: String, Fhasta: String): Vacaciones
        gestionaVacaciones(_id: String, estado: String): Vacaciones
        deleteVacaciones(_id: String): Vacaciones
    }
`