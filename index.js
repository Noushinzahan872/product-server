const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yyvxar9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// --------- MIDDLEWARE ---------
app.use(cors());          // Enable CORS for all routes
app.use(express.json());  // Parse JSON request body
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    db = client.db("shoeCollection");
    const userCollection = db.collection('users')
    app.post("/bags", async (req, res) => {
      try {
        const shoeData = req.body;

        const result = await db.collection("shoes").insertOne(shoeData);
        res.status(201).json({ message: "bag added successfully", data: result });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add bag" });
      }
    });
    app.get("/display/bags", async (req, res) => {
      try {
        const shoes = await db.collection("shoes").find({}).toArray();
        res.status(200).json({ data: shoes });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch bags" });
      }
    })
    app.get("/display/bags/:id", async (req, res) => {
      try {
        const { id } = req.params;
        console.log(id)
        const product = await db.collection("shoes").findOne({ _id: new ObjectId(id) });

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
      } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
      }
    });
    app.post('/users', async (req, res) => {
      try {
        const userData = req.body;
        const result = await userCollection.insertOne(userData);
        res.status(201).json({ message: "Bag added successfully", data: result });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add bag" });
      }
    })
    // Get user by email
app.get("/users/:email", async (req, res) => {
  try {
    const { email } = req.params; // extract email from URL
    console.log("Searching for user by email:", email);

    // Find one user (since emails are usually unique)
    const user = await userCollection.findOne({ email });


    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// --------- ROUTES ---------
app.get("/", (req, res) => {
  res.send("Bagify Express Server");
});


// --------- START SERVER ---------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

