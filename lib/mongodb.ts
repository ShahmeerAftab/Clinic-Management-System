import mongoose from "mongoose";
const MONGODB_URI= process.env.MONGODB_URI
if (!MONGODB_URI) {
   throw new Error("Define mongoDBURL in env.local file")
}
export const connectdb = async() => {
    if (mongoose.connection.readyState===1)return
    await mongoose.connect(MONGODB_URI !)
}