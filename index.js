const express = require('express');
const cors = require ('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware...
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pywpewq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('careerMaker').collection('services');
    const bookingCollection = client.db('careerMaker').collection('bookings');

    app.post('/jwt', async(req, res)=>{
      const user = req.body;
      console.log(user)
      res.send(user);
    })
    app.post('/services',async(req, res)=>{
      const service = req.body;
      const result= await serviceCollection.insertOne(service);
      res.send(result);
    })
    app.get('/services', async(req, res)=>{
        const cursor = serviceCollection.find()
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/services/:id',async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const options = {
            projection: {   _id :1, serviceImage:1, serviceName:1, serviceDescription:1, serviceProviderImage:1, serviceProviderName:1, servicePrice:1 },
          };
        const result = await serviceCollection.findOne(query,options)
        res.send(result);
    })

    // booking api

    app.post('/bookings', async(req, res)=>{
        const booking = req.body;
        result = await bookingCollection.insertOne(booking);
        res.send(result);
    })
    app.get('/bookings', async(req, res)=>{
        let query ={};
        if(req.query?.email){
            query={email: req.query?.email}
        }
        const result = await bookingCollection.find(query).toArray();
        res.send(result);
    })
    app.delete('/bookings/:id',async(req, res)=>{
      const id =req.params.id;
      const query={_id : new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query)
      res.send(result); 
             
    })
    
    app.patch('/bookings/:id', async(req, res)=>{
      const id = req.params.id;
      const filter ={_id : new ObjectId(id)}
      const updatedBooking = req.body;
      const updateDoc = {
        $set: {
          status: updatedBooking.status
        },
      };
      const result = await bookingCollection.updateOne(filter, updateDoc)
      res.send(result);

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


app.get('/', (req, res)=>{
     res.send('Hello , Career maker');
})

app.listen(port, ()=>{
    console.log(`Career maker server running port :${port}`);
})