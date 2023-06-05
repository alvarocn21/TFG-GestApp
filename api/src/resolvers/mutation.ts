import { ApolloError } from "apollo-server";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

export const Mutation = {
    logIn: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const { correo, contrasena } = args;

        const user = await db.collection("Usuarios").findOne({ correo: correo.toLowerCase() });

        if (user) {
            if (compareSync(contrasena, user.contrasena) == true) {
                const token = uuid();
                await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { token: token } });
                return {
                    _id: user._id,
                    nombre: user.nombre,
                    apellido1: user.apellido1,
                    apellido2: user.apellido2,
                    telefono: user.telefono,
                    contrasena: user.contrasena,
                    token,
                    corre: user.correo,
                    horasSemanales: user.horasSemanales,
                    diasHabiles: user.diasHabiles,
                    cargo: user.cargo,
                    dni: user.dni,
                    direccion: user.direccion,
                }
            } else {
                return new ApolloError("Contraseña incorrecta.");
            }
        } else {
            return new ApolloError("Usuario no encontrado.");
        }
    },
    logOut: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { token: null } });
        return {
            _id: user._id,
            nombre: user.nombre,
            apellido1: user.apellido1,
            apellido2: user.apellido2,
            telefono: user.apellido2,
            contrasena: user.contrasena,
            token: null,
            corre: user.correo,
            horasSemanales: user.horasSemanales,
            diasHabiles: user.diasHabiles,
            cargo: user.cargo,
            dni: user.dni,
            direccion: user.direccion
        };
    },
    recuperarContrasena: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const correo = args.correo;

        const usuario = await db.collection("Usuarios").findOne({ correo: correo.toLowerCase() });


        if (usuario) {
            return usuario;
        } else {
            throw new ApolloError("Usuario no encontrado");
        }
    },

    createUser: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const { nombre, apellido1, apellido2, telefono, contrasena, correo, horasSemanales, diasHabiles, cargo, dni, direccion } = args;

        const usuario = await db.collection("Usuarios").findOne({ correo: correo.toLowerCase() });

        if (usuario) {
            return new ApolloError("Usuario ya registrado");
        } else {
            const salt = genSaltSync(contrasena.length);
            const hash = hashSync(contrasena, salt);

            const insertedId = await db.collection("Usuarios").insertOne({ nombre, apellido1, apellido2, telefono, contrasena: hash, token: null, correo: correo.toLowerCase(), horasSemanales, diasHabiles, cargo, dni, direccion });

            return {
                _id: insertedId.insertedId,
                nombre,
                apellido1,
                apellido2,
                telefono,
                contrasena: hash,
                token: null,
                correo,
                horasSemanales,
                diasHabiles,
                cargo,
                dni
            }
        }
    },

    editUserAdmin: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { _id, correo, contrasena } = args;
        const usuario = await db.collection("Usuarios").findOne({ _id: new ObjectId(_id) });

        if (!usuario) {
            return new ApolloError("Usuario no encontrado");
        } else {
            if (contrasena !== "") {
                const salt = genSaltSync(contrasena.length);
                const hash = hashSync(contrasena, salt);
                await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { contrasena: hash, correo: correo.toLowerCase() } });
            } else {
                await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { correo: correo.toLowerCase() } });
            }

            return usuario;
        }
    },

    userChangePassword: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { contrasena } = args;

        const usuario = await db.collection("Usuarios").findOne({ _id: user._id });
        if (!usuario) {
            return new ApolloError("Usuario no existe");
        } else {
            const salt = genSaltSync(contrasena.length);
            const hash = hashSync(contrasena, salt);
            await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { contrasena: hash } });

            return usuario;
        }
    },

    setVacaciones: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { Fdesde, Fhasta, idAusencia } = args;

        let diasVacas: String[] = [];

        const fechaInicio = new Date(Fdesde)
        const fechaFin = new Date(Fhasta)

        if (fechaInicio < new Date() || fechaFin < new Date()) return new ApolloError("Las fechas tienen que ser posteriores al dia de hoy.");

        if (fechaInicio > fechaFin) {
            return new ApolloError("La fecha de inicio es mayor a la fecha fin");
        } else {
            fechaFin.setDate(fechaFin.getDate() + 1);
            while (fechaInicio < fechaFin) {
                diasVacas.push(new Date(fechaInicio).toLocaleDateString());
                fechaInicio.setDate(fechaInicio.getDate() + 1);
            }
        }

        if (user.diasHabiles == 0 || user.diasHabiles < diasVacas.length) {
            return new ApolloError("No tienes dias habiles");
        } else {
            await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { $set: { diasHabiles: user.diasHabiles - diasVacas.length } });
            const usuario = await db.collection("Usuarios").findOne({ _id: user._id });
            const insertedId = await db.collection("Vacaciones").insertOne({ persona: usuario._id, idAusencia, correoPersona: usuario.correo, diasVacas, estado: "Solicitada", });
            return {
                _id: insertedId.insertedId,
                correoPersona: usuario._id,
                persona: user._id,
                diasVacas,
                estado: "Solicitada"
            }
        }
    },
    gestionaVacaciones: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { _id, estado } = args;

        const Vacaciones = await db.collection("Vacaciones").findOne({ _id: new ObjectId(_id), estado: "Solicitada" });

        if (Vacaciones) {
            if (estado == "Denegada") {
                await db.collection("Usuarios").findOneAndUpdate({ _id: Vacaciones.persona }, { '$set': { diasHabiles: user.diasHabiles + Vacaciones.diasVacas.length } });
                await db.collection("Vacaciones").findOneAndUpdate({ _id: new ObjectId(_id) }, { '$set': { estado: "Denegada" } });
            } else await db.collection("Vacaciones").findOneAndUpdate({ _id: new ObjectId(_id) }, { '$set': { estado: "Aceptada" } });
        }
        else return new ApolloError("Registro no encontrado o solicitud ya gestionada.");
        return Vacaciones;
    },
    deleteVacaciones: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { _id } = args;

        const Vacaciones = await db.collection("Vacaciones").findOne({ _id: new ObjectId(_id) });

        if (Vacaciones) {
            if (Vacaciones.estado == "Solicitada") {
                await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { diasHabiles: user.diasHabiles + Vacaciones.diasVacas.length } });
                await db.collection("Vacaciones").deleteOne({ _id: new ObjectId(_id) })
            } else {
                return new ApolloError("Solo se pueden borrar Vacaciones en estado Solicitadas");
            }
        }
        else return new ApolloError("Registro no encontrado");
        return Vacaciones;
    },

    setFichaje: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { hora, comentario } = args;

        const insertedId = await db.collection("Fichaje").insertOne({ persona: user._id, fecha: new Date().toLocaleDateString(), entradasSalidas: hora, comentario: comentario });
        return {
            _id: insertedId.insertedId,
            persona: user._id,
            fecha: new Date().toDateString(),
            entradasSalidas: hora,
            comentario: comentario,
        }
    },
    editFichaje: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { _id, hora, comentario } = args;

        const fichaje = await db.collection("Fichaje").findOne({ _id: new ObjectId(_id) });

        if (fichaje) await db.collection("Fichaje").findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: { entradasSalidas: hora, comentario } });
        else return new ApolloError("Registro no encontrado");
        return {
            _id: new ObjectId(_id),
            fecha: fichaje.fecha,
            persona: user._id,
            entradasSalidas: hora,
            comentario
        }
    },
    deleteFichaje: async (parent: any, args: any, context: any) => {
        const { db } = context;
        const { _id } = args;

        const fichaje = await db.collection("Fichaje").findOne({ _id: new ObjectId(_id) });

        if (fichaje) await db.collection("Fichaje").deleteOne({ _id: new ObjectId(_id) })
        else return new ApolloError("Registro no encontrado");
        return fichaje;
    },
    setTrabajoReg: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { tiempo, trabajoRealizado, Fdesde, comentario } = args;

        const insertedId = await db.collection("TrabajoReg").insertOne({ persona: user._id, tiempo, fecha: new Date().toLocaleDateString(), trabajoRealizado, Fdesde, comentario });
        return {
            _id: insertedId.insertedId,
            persona: user._id,
            fecha: new Date().toLocaleDateString(),
            tiempo,
            trabajoRealizado,
            Fdesde,
            comentario
        }
    },
    editTrabajoReg: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { _id, tiempo, trabajoRealizado, Fdesde, comentario } = args;

        const trabRegHoy = await db.collection("TrabajoReg").findOne({ _id: new ObjectId(_id) });

        if (trabRegHoy) await db.collection("TrabajoReg").findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: { tiempo, trabajoRealizado, Fdesde, comentario } });
        else return new ApolloError("Registro no encontrado");
        return {
            _id: new ObjectId(_id),
            persona: user._id,
            fecha: trabRegHoy.fecha,
            tiempo,
            trabajoRealizado,
            Fdesde,
            comentario
        }
    },
    deleteTrabajoReg: async (parent: any, args: any, context: any) => {
        const { db } = context;
        const { _id } = args;

        const trabRegHoy = await db.collection("TrabajoReg").findOne({ _id: new ObjectId(_id) });

        if (trabRegHoy) await db.collection("TrabajoReg").deleteOne({ _id: new ObjectId(_id) })
        else return new ApolloError("Registro no encontrado");
        return trabRegHoy;
    }
}


