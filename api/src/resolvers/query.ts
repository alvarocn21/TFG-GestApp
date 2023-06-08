import { ObjectId } from "mongodb";

export const Query = {
    getVacacionesUsu: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const vacaciones: any = await db.collection("Vacaciones").find({ persona: user._id }).toArray();
        if (vacaciones) return vacaciones;
        else return "Aun no hay Vacaciones solicitadas";
    },
    getVacacionesAdmin: async (parent: any, args: any, context: any) => {
        const { db } = context;

        const vacaciones: any = await db.collection("Vacaciones").find({ estado: "Solicitada" }).toArray();

        if (vacaciones) return vacaciones;
        else return "Aun no hay Vacaciones solicitadas";
    },
    getFichaje: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const fichajes = await db.collection("Fichaje").find({ persona: user._id, fecha: new Date().toLocaleDateString() }).toArray();
        if (fichajes) return fichajes;
        else return "Aun no hay Fichajes solicitados";
    },
    getFichajeMens: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { mes, anio } = args;

        console.log(mes + "/" + anio)

        const fichajes = await db.collection('Fichaje').find({
            persona: new ObjectId(user._id),
            fecha: {
                $regex: `^${mes}/\\d{1,2}/${anio}`,
                $options: 'i'
            },
        }).toArray();

        if (fichajes) return fichajes;
        else return "Aun no hay Fichajes solicitados";
    },
    getTrabajoReg: async (parent: any, args: any, context: any) => {
        const { db, user } = context;

        const trabajoReg = await db.collection("TrabajoReg").find({ persona: user._id, fecha: new Date().toLocaleDateString() }).toArray();

        if (trabajoReg) return trabajoReg;
        else return "Aun no hay Trabajo registrado";
    },
    getTrabajoRegMens: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { mes, anio } = args;

        const trabajoReg = await db.collection("TrabajoReg").find({
            persona: new ObjectId(user._id),
            fecha: {
                $regex: `^${mes}/\\d{1,2}/${anio}`,
                $options: 'i'
            },
        }).toArray();

        console.log(mes + "/" + anio + "----" + trabajoReg)

        if (trabajoReg) return trabajoReg;
        else return "Aun no hay Trabajo registrado";
    },
    getUser: async (parent: any, args: any, context: any) => {
        const { user } = context;
        if (user) return user;
        else return "Usuario no existe";
    },
}
