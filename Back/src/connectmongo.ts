import { Db, MongoClient } from "mongodb";

export const connectDB = async (): Promise<Db> => {
  
  const dbName: string = "myAppTfg";
  const usr = "Alvaro";
  const pwd = "Naciones2";

  const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ulh10.mongodb.net/${dbName}?retryWrites=true&w=majority`;
         
  const client = new MongoClient(mongouri);

  try {
    await client.connect();
    console.info(`MongoDB connected`);
    
    return client.db(dbName);
  } catch (e) {
    throw e;
  }
};