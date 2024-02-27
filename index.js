const express = require("express");
const { createConnection } = require("mysql");
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

async function startServer() {
  const url = "mongodb://localhost:27017/DemoDB";
  const port = 3000;
  try {
    // Connect to MongoDB
    const client = new MongoClient(url);
    await client.connect();

    // Define a route to get all books
    app.get("/api/getbooks", async (req, res) => {
      try {
        // Access the "books" collection and retrieve all documents
        const collection = client.db("DemoDB").collection("books");
        const books = await collection.find().toArray();
        res.json({ data: books, message: "", status: 200 });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Start the server
startServer();

//---------------------------------------------MYSQL CONNECTION-------------------------------------------------------------//

// here we get .env variables
PORT = process.env.PORT || 8085;

// here we listen the server from  the begining
app.listen(PORT, () => {
  console.log(`server is listening at port ${PORT}`);
});

const db = createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Mysql Database Connected");
});

app.get("/api/getOrderList", (req, res) => {
  db.query("call getOrderList()", (err, result) => {
    if (err) {
      res.json({ message: "Something went wrong.", error: err });
    } else {
      res.json({ status: 200, data: result });
    }
  });
});
