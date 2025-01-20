import mongoose from "mongoose"

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection

        connection.on('connected', () => {
            console.log("MongoDB connected");
        })

        connection.on('error', (err) => {
            throw err
        })

    } catch (error) {
        console.log("Problem connecting to DB", error);
    }
}