export const Query = {
    getVacaciones: async (parent: any, args: any, context: any) => { 
        const db = context.db;
        const user = context.user;

        const vacaciones: any = await db.collection("Vacaciones").find({persona: user._id}).toArray();
        if (vacaciones) return vacaciones;
        else return 0;
    },
    getFichaje: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const user = context.user;

        const f = new Date();
        const fecha = f.getFullYear() + "-" + f.getMonth() + "-" + f.getDate();
        const fichaje = await db.collection("Fichaje").find({ persona: user._id, fecha}).toArray();
        if (fichaje) return fichaje;
        else return 0;
    },
    getTrabajoReg: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const user = context.user;

        const f = new Date();
        const fecha = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate();
        const trabajoReg = await db.collection("TrabajoReg").find({ persona: user._id, fecha}).toArray();
        if (trabajoReg) return trabajoReg;
        else return 0;
    },
    getUser: async (parent: any, args: any, context: any) => {
        const { db, user } = context;
        
        if(user) return user;
        else return 0;
    },
    getMes: async (parent: any, args: any, context: any) => {
        const db = context.db;
        const { mes } = args;

        const diasMeses = await db.collection("DiasMeses").findOne({ meses: mes });
        if (diasMeses) return diasMeses;
        else return 0;
    }
}
