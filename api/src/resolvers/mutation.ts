import { ApolloError } from "apollo-server";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";
import { compareSync, genSaltSync, hashSync } from "bcrypt";
import nodemailer from "nodemailer";

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

        const usuario = await db.collection("Usuarios").findOne({ correo: correo });
// console.log("A")
         if (usuario) {
//             let testAccount = await nodemailer.createTestAccount();
//             console.log("A")
//             // create reusable transporter object using the default SMTP transport
//             let transporter = nodemailer.createTransport({
//                 host: "4000",
//                 port: 465,
//                 secure: false, // true for 465, false for other ports
//                 auth: {
//                     user: testAccount.user, // generated ethereal user
//                     pass: testAccount.pass, // generated ethereal password
//                 },
//             });
//             console.log("A")
//             // send mail with defined transport object
//             let info = await transporter.sendMail({
//                 from: '"Fred Foo 👻" <foo@example.com>', // sender address
//                 to: "alvaroocn21@gmail.com, baz@example.com", // list of receivers
//                 subject: "Hello ✔", // Subject line
//                 text: "Hello world?", // plain text body
//                 html: "<b>Hello world?</b>", // html body
//             });
//             console.log("A")
//             console.log("Message sent: %s", info.messageId);
//             // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

//             // Preview only available when sending through an Ethereal account
//             console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

            return usuario;
        } else {
            throw new ApolloError("Usuario no encontrado");
        }
    },

    createUser: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const { nombre, apellido1, apellido2, telefono, contrasena, correo, horasSemanales, diasHabiles, cargo, dni, direccion} = args;

        const usuario = await db.collection("Usuarios").findOne({ correo: { $regex: correo, $options: 'i' } });

        if (usuario) {
            return new ApolloError("Usuario ya registrado");
        } else {
            const salt = genSaltSync(contrasena.length);
            const hash = hashSync(contrasena, salt);

            const insertedId = await db.collection("Usuarios").insertOne({ nombre, apellido1, apellido2, telefono, contrasena: hash, token: null, correo: correo.toLowerCase(), horasSemanales, diasHabiles, cargo, dni, direccion});

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

    editUser: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { contrasena } = args;
        const usuario = await db.collection("Usuarios").findOne({ _id: user._id});
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
        const { Fdesde, Fhasta,  idAusencia } = args;

        let diasVacas: string[] = [];

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

        const insertedId = await db.collection("Fichaje").insertOne({ persona: user._id, fecha: new Date().toDateString(), entradasSalidas: hora, comentario: comentario });
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
    },
    masMeses: async (parent: any, args: any, context: any) => {
        const { db } = context; // "Diciembre, 2023" 31 - 28 - 31 - 30 - 31 - 30 - 31 - 31 - 30 - 31 - 30 - 31
        const mes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const diasMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        for (let a = 0; a < mes.length; a++) {
            const meses = mes[a] + "," + "2024";
            let c: string[] = [];
            for (let i = 1; i <= diasMes[a]; i++) {
                let b = "2024" + "-" + (a + 1) + "-" + i;
                c.push(b);
            }
            await db.collection("DiasMeses").insertOne({ meses, dias: c });
        }

        return 0;
    },
}


