const express = require("express");
const mysql = require("mysql");
const { MongoClient } = require("mongodb");

//----------------------------------------------------------------------------------------------------------//
const app = express();
app.use(express.json()); // here we enable to use json parser for convert data into json format
app.use(express.urlencoded({ extended: true })); // here we enable  to get data into form format and make it encoded url

if (process.env.NODE_ENV !== "production") {
  // here we all access to get .env file data
  require("dotenv").config();
}
//----------------------------------------------------------------------------------------------------------//

//-----------------------------------------------MONGODB CONNECTION-----------------------------------------------------------//

// async function startServer() {
//   const url = "mongodb://localhost:27017/DemoDB";
//   const port = 3000;
//   try {
//     // Connect to MongoDB
//     const client = new MongoClient(url);
//     await client.connect();

//     // Define a route to get all books
//     app.get("/api/getbooks", async (req, res) => {
//       try {
//         // Access the "books" collection and retrieve all documents
//         const collection = client.db("DemoDB").collection("books");
//         const books = await collection.find().toArray();
//         res.json({ data: books, message: "", status: 200 });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//     });

//     // Start the server
//     app.listen(port, () => {
//       console.log(`Server is listening at http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }

// Start the server
// startServer();

//---------------------------------------------MYSQL CONNECTION-------------------------------------------------------------//
// Initialize pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: 'root',
  password: 'password',
  database: 'classicmodels',
});

const PORT = 3000; // Choose any available port

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/getOrderList", (req, res) => {
  pool.query("call getOrderList()", (err, result) => {
    if (err) {
      res.json({ message: "Something went wrong.", error: err });
    } else {
      res.json({ status: 200, data: result });
    }
  });
});
