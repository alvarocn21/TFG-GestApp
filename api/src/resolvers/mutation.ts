import { ApolloError } from "apollo-server";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import nodemailer from 'nodemailer';

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
                    correo: user.correo,
                    horasSemanales: user.horasSemanales,
                    diasHabiles: user.diasHabiles,
                    permisos: user.permisos,
                    dni: user.dni,
                    cargo: user.cargo,
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
            permisos: user.permisos,
            dni: user.dni,
            direccion: user.direccion
        };
    },
    recuperarContrasena: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const correo = args.correo;

        const usuario = await db.collection("Usuarios").findOne({ correo: correo.toLowerCase() });

        if (usuario) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'passworrdrecover@gmail.com',
                    pass: 'rikvqeblwielmojs'
                }
            });
            
            try {

                const token = uuid();

                const mailOptions = {
                    from: 'passworrdrecover@gmail.com',
                    to: correo,
                    subject: 'Recuperación de contraseña',
                    text: `Esta es tu nueva contraseña: ${token}, recuerda una vez inicies sesión cambiar la contraseña en la pantalla de Perfil de Usuario`
                };

                const salt = genSaltSync(10);
                const hash = hashSync(token, salt);

                await db.collection("Usuarios").findOneAndUpdate({ _id: usuario._id }, { '$set': { contrasena: hash } });

                await transporter.sendMail(mailOptions);

                return usuario;
            } catch (error) {
                console.error('Error al enviar el correo electrónico:', error);
                throw new ApolloError('Ocurrió un error al enviar el correo electrónico de recuperación de contraseña');
            }
        } else throw new ApolloError("Usuario no encontrado");
    },
    createUser: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const { nombre, apellido1, apellido2, telefono, contrasena, correo, horasSemanales, cargo, turno, diasHabiles, permisos, dni, direccion } = args;

        const usuario = await db.collection("Usuarios").findOne({ correo: correo.toLowerCase() });

        if (usuario) {
            return new ApolloError("Usuario ya registrado");
        } else {
            const salt = genSaltSync(10);
            const hash = hashSync(contrasena, salt);

            const insertedId = await db.collection("Usuarios").insertOne({ nombre, apellido1, apellido2, telefono, contrasena: hash, token: null, correo: correo.toLowerCase(), turno, cargo, horasSemanales, diasHabiles, permisos, dni, direccion });

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
                permisos,
                turno,
                cargo,
                dni
            }
        }
    },
    editUser: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { correo, contrasena, telefono, direccion, dni } = args;

        const comprobarCorreo = await db.collection("Usuarios").findOne({ _id: { $ne: user._id }, correo: correo });

        if (comprobarCorreo) return new ApolloError("Ese correo ya esta en uso.");

        if (contrasena !== "") {
            const salt = genSaltSync(10);
            const hash = hashSync(contrasena, salt);
            await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { contrasena: hash, correo: correo.toLowerCase(), telefono, direccion, dni } });
        } else {
            await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { correo: correo.toLowerCase(), telefono, direccion, dni } });
        }
        await db.collection("Ausencia").findOneAndUpdate({ _id: user._id }, { '$set': { correo: correo.toLowerCase() } });
        return user;

    },
    setFichaje: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { motivo } = args;

        if (motivo && motivo != "") {
            const fecha = new Date().toLocaleDateString();
            const hora = new Date().toTimeString().slice(0, 8);

            const insertedId = await db.collection("Fichaje").insertOne({ persona: user._id, fecha, hora, motivo });
            return {
                _id: insertedId.insertedId,
                persona: user._id,
                fecha,
                hora,
                motivo: motivo,
            }
        } else return new ApolloError("Se debe introducir el motivo del fichaje");
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

        if (tiempo && trabajoRealizado && Fdesde && tiempo != 0 && trabajoRealizado != "" && Fdesde != "") {
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
        } else return new ApolloError("Alguno de los campos no esta relleno");
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
    },
    setAusencia: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { Fdesde, Fhasta, idAusencia } = args;


        let diasVacas: String[] = [];

        const fechaInicio = new Date(Fdesde)
        const fechaFin = new Date(Fhasta)

        if (user.diasHabiles == 0 || user.diasHabiles < diasVacas.length) {
            return new ApolloError("No tienes dias habiles");
        } else {
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

            await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { $set: { diasHabiles: user.diasHabiles - diasVacas.length } });
            const usuario = await db.collection("Usuarios").findOne({ _id: user._id });
            const insertedId = await db.collection("Ausencia").insertOne({ persona: usuario._id, idAusencia, correoPersona: usuario.correo, diasVacas, estado: "Solicitada", });
            return {
                _id: insertedId.insertedId,
                correoPersona: usuario._id,
                persona: user._id,
                diasVacas,
                estado: "Solicitada"
            }
        }
    },
    gestionaAusencia: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { _id, estado } = args;

        const Ausencia = await db.collection("Ausencia").findOne({ _id: new ObjectId(_id), estado: "Solicitada" });

        if (Ausencia) {
            if (estado == "Denegada") {
                await db.collection("Usuarios").findOneAndUpdate({ _id: Ausencia.persona }, { '$set': { diasHabiles: user.diasHabiles + Ausencia.diasVacas.length } });
                await db.collection("Ausencia").findOneAndUpdate({ _id: new ObjectId(_id) }, { '$set': { estado: "Denegada" } });
            } else await db.collection("Ausencia").findOneAndUpdate({ _id: new ObjectId(_id) }, { '$set': { estado: "Aceptada" } });
        }
        else return new ApolloError("Registro no encontrado o solicitud ya gestionada.");
        return Ausencia;
    },
    deleteAusencia: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { _id } = args;

        const Ausencia = await db.collection("Ausencia").findOne({ _id: new ObjectId(_id) });

        if (Ausencia) {
            if (Ausencia.estado == "Solicitada") {
                await db.collection("Usuarios").findOneAndUpdate({ _id: user._id }, { '$set': { diasHabiles: user.diasHabiles + Ausencia.diasVacas.length } });
                await db.collection("Ausencia").deleteOne({ _id: new ObjectId(_id) })
            } else {
                return new ApolloError("Solo se pueden borrar Ausencia en estado Solicitadas");
            }
        }
        else return new ApolloError("Registro no encontrado");
        return Ausencia;
    },
}


