const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmvhoig.mongodb.net/?retryWrites=true&w=majority`;


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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const postCollection = client.db("postMaker").collection("post")
        const userCollection = client.db("postMaker").collection("user")
        const bioCollection = client.db("postMaker").collection("bio")

        app.get('/postt', async (req, res) => {
            const result = await postCollection.find().sort({ date: -1 }).toArray();
            res.send(result)
        })
        app.get('/userr', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result)
        })

        app.post("/post", async (req, res) => {
            const user = req.body;
            const result = await postCollection.insertOne(user);
            res.send(result)
        })
        app.post("/user", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        app.get("/post", async (req, res) => {
            const query = { email: req.query.email }
            const result = await postCollection.find(query).sort({ date: -1 }).toArray();
            res.send(result)
        })

        app.get("/userr/:id", async(req, res)=>{
            const id= req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await userCollection.findOne(query);
            res.send(result)
        })

        app.get("/bio", async(req, res)=>{
            const result = await bioCollection.find().toArray();
            res.send(result)
        })
        app.get("/biod", async (req, res) => {
            const query = { email: req.query.email }
            const result = await bioCollection.find(query).toArray();
            res.send(result)
        })
        app.post('/bio', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await bioCollection.insertOne(user);
            res.send(result)
        })

        app.patch('/bio/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updated = req.body;
            const updatedBio = {
                $set: {
                    bio: updated.bio,
                }
            }
            const result = await bioCollection.updateOne(filter, updatedBio);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Toy making server is runninggggg");
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
