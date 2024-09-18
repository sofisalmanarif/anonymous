import mongoose from "mongoose";

type ConnectionObj ={
    isConnected?:number
}

const connection:ConnectionObj = {}

async function dbConnect ():Promise<void>{
    if(connection.isConnected){
        console.log("database is already connected")
        return;
    }

    try {
        const dbConnection = await mongoose.connect(process.env.MONGO_URI ||"")
        connection.isConnected = dbConnection.connections[0].readyState;
        console.log(dbConnection)
        console.log("Database connected Successfully")
    } catch (error) {
        console.log("Database connection failed")
        process.exit(1)
    }

}

export default dbConnect;