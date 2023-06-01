import { ApolloError, ApolloServer, gql } from "apollo-server"
import { connectDB } from "./connectmongo"
import { typeDefs } from "./schema"
import { Query } from "./resolvers/query"
import { Mutation } from "./resolvers/mutation"

const resolvers = {
  Query,
  Mutation
}

const run = async () => {
  const db = await connectDB();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      const reqAuth = ["getUser", "editUser", "getVacaciones", "gestionaVacaciones", "getFichaje", "editFichaje", "deleteFichaje", "getTrabajoReg", "logOut", "createUser", "setVacaciones", "editVacaciones", "deleteVacaciones", "setFichaje", "setTrabajoReg", "deleteTrabajoReg", "editTrabajoReg", "getMes"];
      if (reqAuth.some((q) => req.body.query.includes(q))) {
        const token = req.headers.authorization || "";
        if (token != "") {
          const user = await db.collection("Usuarios").findOne({ token });
          if (user) return { db, user }; else throw new ApolloError("No autorizado", "403");
        } else throw new ApolloError("No autorizado", "403");
      } else return { db };
      // const user = await db.collection("Usuarios").findOne({ correo: "A@gmail.com", contrasena: "$2b$04$EU2I.QWclj824G.XRW/QjO2O/S1UAcCbnCLwlTMUXrBOG2bRWGFeu"})
      // return { db, user }
    },
  });

  server.listen({ port: 4000 }).then(({url}) => {
    console.log(`Server ready on ${url}`);
  });
}
try {
  run()
} catch (e) {
  console.error(e);
}
