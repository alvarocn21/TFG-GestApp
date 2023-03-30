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
      const reqAuth = ["getVacaciones", "getFichaje", "editFichaje", "deleteFichaje", "getUser", "getTrabajoReg", "logOut", "createUser", "setVacaciones", "editVacaciones", "deleteVacaciones", "setFichaje", "setTrabajoReg", "deleteTrabajoReg", "editTrabajoReg", "getMes"];
      if (reqAuth.some((q) => req.body.query.includes(q))) {
        const token = req.headers.authorization || "";
        if (token != "") {
          const user = await db.collection("Usuarios").findOne({ token });
          if (user) return { db, user }; else throw new ApolloError("No autorizado", "403");
        } else throw new ApolloError("No autorizado", "403");
      } else {
        new ApolloError("Token no autorizado", "403");
        return {
          db
        }
      };
       //const user = await db.collection("Usuarios").findOne({ correo: "acallejan@alumnos.nebrija.es" })
       //return { db, user }
    },
  });

  server.listen(4000).then(() => {
    console.log(`Server ready on 4000`);
  });
}
try {
  run()
} catch (e) {
  console.error(e);
}
