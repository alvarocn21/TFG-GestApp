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
        cargo: String!
        horasSemanales: Float!
        diasHabiles: Float!
        turno: String!
        dni: String!
        direccion: String!
    }

    type Vacaciones {
        _id: String!
        persona: String!
        idAusencia: String!
        correoPersona: String!
        diasVacas: [String!]
        estado: String!
    }

    type Fichaje {
        _id: String!
        persona: String!
        fecha: String!
        hora: String!
        motivo: String!
    }

    type TrabajoReg {
        _id: String!
        persona: String!
        fecha: String!
        tiempo: Float
        trabajoRealizado: String!
        Fdesde: String!
        comentario: String
    }

    type Query{
        getVacacionesUsu: [Vacaciones]!
        getVacacionesAdmin: [Vacaciones]!

        getFichaje: [Fichaje]!
        getFichajeMens(mes: String, anio: String): [Fichaje]!

        getTrabajoReg: [TrabajoReg]!
        getTrabajoRegMens(mes: String, anio: String): [TrabajoReg]!

        getUser: Persona!
        getUsers: [Persona]!
    }

    type Mutation{
        logIn(correo: String, contrasena: String): Persona!
        logOut: Persona!
        recuperarContrasena(correo: String): Persona!

        createUser(nombre: String, apellido1: String, apellido2: String, telefono: String, contrasena: String, correo: String, turno: String,horasSemanales: Float, diasHabiles: Float, permisos: String, dni: String,direccion: String): Persona!
        userChangePassword(contrasena: String): Persona!
        editUser(correo: String, contrasena: String, telefono: String, dni: String, direccion: String): Persona!

        setTrabajoReg(tiempo: Float, trabajoRealizado: String, Fdesde: String, comentario: String): TrabajoReg!
        editTrabajoReg(_id: String, tiempo: Float, trabajoRealizado: String, Fdesde: String, comentario: String): TrabajoReg!
        deleteTrabajoReg(_id: String): TrabajoReg!

        setFichaje(hora: String, motivo: String): Fichaje!
        editFichaje(_id: String, hora: String, motivo: String): Fichaje!
        deleteFichaje(_id: String): Fichaje!

        setVacaciones(Fdesde: String, Fhasta: String, idAusencia: String): Vacaciones!
        gestionaVacaciones(_id: String, estado: String): Vacaciones!
        deleteVacaciones(_id: String): Vacaciones!
    }
`