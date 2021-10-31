const express = require('express');
const app = express(); 
const port = process.env.PORT || 5000;

// for .env variable must have declare.
require('dotenv').config()

// middlewaire.......
var cors = require("cors");
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;

//external 
const { MongoClient } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6fw9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// ALl Works will happen happend.
async function run () {
    try {
       await client.connect();
       const database = client.db("Be-Foody");  
       const FoodCollection = database.collection("Foods"); 
       const OrderCollection = database.collection("Orders"); 
       const confirmOrders = database.collection("Confirm-Order");

       
    // Geting data from Database API..................
    app.use('/foods', async (req, res)=>{
        const result = await FoodCollection.find({}).toArray();
        res.send(result);
    })  
       
    
    // Inserting Product to OrderCollection........... 
    app.post('/addToCart', async (req, res)=>{
        const query = {key:req.body.key}
        const checkdata = await  OrderCollection.findOne(query);
        if(checkdata){
           res.json('Product ALready Exist!');
        }else{
         const result = await OrderCollection.insertOne(req.body);
         res.send(result);
        }
    })



    // Getting OrderCollection Data for Showing annother Route. 
    app.get('/orderCollection/:email', async (req, res)=>{ 
        const email = { email: req.params.email };
          const result = await OrderCollection.find(email).toArray();
          res.send(result);
        }
    )


    // Cancel Product from Order List...............
    app.delete("/deleted/:key", async (req, res) => {
       const key = req.params.key;
       const result = await OrderCollection.deleteOne({key});
        res.send(result);
      });

    

    // Get User information......................... 
    app.post('/placeorder', async (req, res) =>{
        // console.log(req);
        const result = await confirmOrders.insertOne(req.body);
        console.log(result);
        res.send(result);
    })


    // get Confirm Order Information.
    app.get('/confirmorder', async (req, res) =>{
        const result = await confirmOrders.find({}).toArray();
        console.log(result);
        res.send(result);
    })


    // Add New Services To Database............... 
    app.post('/addServiceDB', async (req, res) =>{
      const result = await FoodCollection.insertOne(req.body);
      res.send(result);
    })




    // ADmin Pannel................ 
    app.get('/adminPannel', async (req, res)=>{
        console.log('From admin pannel', req.body)
        const result = await confirmOrders.find({}).toArray();
        console.log(result);
        res.send(result);
    })


    // Delete Items from the ADmin pannel.............  
    app.delete('/adminPannel/:key', async (req, res)=>{
        const query = {key: req.body.key};
        console.log(query);
        const result = await confirmOrders.deleteOne(query);
        res.send(result);
    })


    //
    app.put('/adminPannel/approved/:id', async (req, res)=>{
        const query = {_id: ObjectId(req.params.id)}
        // console.log(query);
        // const updateStatus = req.body;
        const result = await confirmOrders.updateOne(query, {
            $set:{
                status: 'Approved'
            }
        });
        console.log(result);
        res.send(result);
    })

    }
    finally {
     // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Server is running...')
});

app.listen(port, () =>{
    console.log('listening on port', port);
})