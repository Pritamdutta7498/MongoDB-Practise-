const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

//use
const uri = "mongodb://127.0.0.1:27017"; //for connection with compass

// for mongodb atlas
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zynq1cd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // here you can start yor work-----

    const productCollection =  client.db("ProductDB").collection("products");

    app.get('/products', async(req, res)=>{

      // const query = {"name": "Sunglasses"}//get the specific data of array

      const query = {}
      const cursor = productCollection.find(query).sort({price: 1})
      // .project({name: true, _id:0, category: true});//get the name and category
      const products = await cursor.toArray();
      res.send(products);


      // simple way
      // const result =  await productCollection.find().toArray();
      // res.send(result);
      
    })




    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("project manager is working");
});
app.listen(port, () => {
  console.log(`project manger is working on port ${port}`);
});
