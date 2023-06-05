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
        const fichaje = await db.collection("Fichaje").find({ persona: user._id, fecha: new Date().toLocaleDateString() }).toArray();
        if (fichaje) return fichaje;
        else return "Aun no hay Fichajes solicitados";
    },
    getFichajeMens: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        const { mes, anio } = args;
        
        const fichaje = await db.collection('Fichaje').find({
            persona: new ObjectId(user._id),
            fecha: { 
                $regex: `^\\d{1,2}/6/2023`, 
                $options: 'i' 
            },
          }).toArray();

        if (fichaje) return fichaje;
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

        const trabajoReg = await db.collection('TrabajoReg').find({
            persona: new ObjectId(user._id),
            fecha: { 
                $regex: `^\\d{1,2}/6/2023`, 
                $options: 'i' 
            },
          }).toArray();

        if (trabajoReg) return trabajoReg;
        else return "Aun no hay Trabajo registrado";
    },
    getUser: async (parent: any, args: any, context: any) => {
        const { user } = context;
        if (user) return user;
        else return "Usuario no existe";
    },
    getUsers: async (parent: any, args: any, context: any) => {
        const { db } = context;

        const usuarios = await db.collection("Usuarios").find({}).toArray();

        if (usuarios) return usuarios;
        else return "No hay usuarios en la base de datos";
    }
}
