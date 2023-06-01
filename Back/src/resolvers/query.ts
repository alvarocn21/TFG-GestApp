import { ObjectId } from "mongodb";

export const Query = {
    getVacacionesUsu: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const vacaciones: any = await db.collection("Vacaciones").find({ persona: user._id }).toArray();
        if (vacaciones) return vacaciones;
        else return "Aun no hay Vacaciones solicitadas";
    },
    getVacacionesAdmin: async (parent: any, args: any, context: any) => {
        const { db, user } = context;

        const vacaciones: any = await db.collection("Vacaciones").find({ diasVacas: { $gt: new Date().toLocaleDateString() } }).toArray();

        if (vacaciones) return vacaciones;
        else return "Aun no hay Vacaciones solicitadas";
    },
    getFichaje: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const fichaje = await db.collection("Fichaje").find({ persona: user._id, fecha: new Date().toLocaleDateString() }).toArray();
        if (fichaje) return fichaje;
        else return "Aun no hay Fichajes solicitados";
    },
    getTrabajoReg: async (parent: any, args: any, context: any) => {
        const { db, user } = context;

        const trabajoReg = await db.collection("TrabajoReg").find({ persona: user._id, fecha: new Date().toLocaleDateString() }).toArray();

        if (trabajoReg) return trabajoReg;
        else return "Aun no hay Trabajo registrado";
    },
    getUser: async (parent: any, args: any, context: any) => {
        const { user } = context;

        if (user) return user;
        else return "Usuario no existe";
    },
    getMes: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const { mes } = args;

        const diasMeses = await db.collection("DiasMeses").findOne({ meses: mes });
        if (diasMeses) return diasMeses;
        else return "Este mes no esta añadido";
    }
}
