import { ObjectId } from "mongodb";

export const Query = {
    getAusenciaUsu: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const vacaciones: any = await db.collection("Ausencia").find({ persona: user._id }).toArray();
        if (vacaciones) return vacaciones;
        else return "Aun no hay ninguna ausencia";
    },
    getAusenciaAdmin: async (parent: any, args: any, context: any) => {
        const { db } = context;

        const vacaciones: any = await db.collection("Ausencia").find({ estado: "Solicitada" }).toArray();

        if (vacaciones) return vacaciones;
        else return "No se ha encontrado ninguna ausencia para ningún empleado";
    },
    getFichaje: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const fichajes = await db.collection("Fichaje").find({ persona: user._id, fecha: new Date().toLocaleDateString() }).toArray();
        if (fichajes) return fichajes;
        else return "Aun no hay Fichajes";
    },
    getFichajeMens: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { mes, anio } = args;

        console.log(mes + "/" + anio)

        const fichajes = await db.collection("Fichaje").find({
            persona: new ObjectId(user._id),
            fecha: {
                $regex: `^${mes}/\\d{1,2}/${anio}`,
                $options: 'i'
            },
        }).toArray();

        if (fichajes) return fichajes;
        else return "No se han encontrado fichajes para los datos introducidos";
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
        else return "No se han encontrado datos para el mes y año introducidos";
    },
    getUser: async (parent: any, args: any, context: any) => {
        const { user } = context;
        if (user) return user;
        else return "Usuario no existe";
    },
}
