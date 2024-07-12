import express, {Express} from "express"; 
import mongoose from "mongoose"; 

const app: Express = express(); 
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/BankManagement").then((data) => {
    console.log(`Connected to MongoDB ${data.connection.name}`);
}).catch((err) => {
    console.log("Connection failed with error: ", err);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})