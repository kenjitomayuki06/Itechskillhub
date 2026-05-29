import dotenv from 'dotenv';
import app from './app.js'; // Note the .js extension!

//load .env file variables
dotenv.config();

//strict environment variable guard
if (!process.env.JWT_SECRET) {
    console.error("========================================================");
    console.error("CRITICAL CONFIGURATION ERROR: JWT_SECRET is not defined!");
    console.error("The server is shutting down to prevent security breaches.");
    console.error("========================================================");
    process.exit(1); // Instantly halts the Node.js runtime process
}



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running securely on port ${port}`);
});
 