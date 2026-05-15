import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

//all the regarding the connection of the database is stored in the .env
dotenv.config();
    //used create pool so that it is not limited to one user or connection
    const pool = mysql.createPool({

        //details regarding host = 127.0.0.1
        host: process.env.MYSQL_HOST,
        //details regarding the user = root
        user: process.env.MYSQL_USER,
        //details regarding the password of the db if there is
        password: process.env.MYSQL_PASSWORD|| '',
        //details regarding the database name
        database: process.env.MYSQL_DATABASE,
        //limited to 25 users
        connectionLimit: 25
    });

   
 export {pool};