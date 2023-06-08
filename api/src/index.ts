import { ApolloError, ApolloServer, gql } from "apollo-server"
import { MongoClient } from "mongodb";
import { typeDefs } from "./schema"
import { Query } from "./resolvers/query"
import { Mutation } from "./resolvers/mutation"

const resolvers = {
  Query,
  Mutation
}

const mongourl = process.env.MONGO_URL;
if (!mongourl) console.error("MONGO_URL env variable not defined")
else {
  const client = new MongoClient(mongourl);
  try {
    client.connect().then(() => {
      console.log("Mongo DB connected");
      const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req, res }) => {

          const reqAuth = ["logOut", "createUser", "editUser",  "setTrabajoReg", "editTrabajoReg", "deleteTrabajoReg", "setFichaje", "deleteFichaje", "setVacaciones", "gestionaVacaciones", "deleteVacaciones", "getVacacionesUsu", "getVacacionesAdmin", "getFichaje", "getFichajeMens", "getTrabajoReg", "getUser"];
          if (reqAuth.some((q) => req.body.query.includes(q))) {
            const token = req.headers.authorization || "";
            if (token != "") {
              const user = await client.db("myAppTfg").collection("Usuarios").findOne({ token });
              if (user) return { db: client.db("myAppTfg"), user: user }; else throw new ApolloError("No autorizado", "403");
            } else throw new ApolloError("No autorizado", "403");
          } else return { db: client.db("myAppTfg") };
        },
      });
      server.listen().then(({ url }) => {
        console.log(`Server ready on ${url}`);
      });
    });
  } catch (e) {
    console.error(e);
  }
}
