//............................
const express = require('express');
const app = express(); 
const port = process.env.PORT || 5000;

// for .env variable must have declare.
require('dotenv').config()

// middlewaire................
var cors = require("cors");
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;

//external....................
const { MongoClient } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6fw9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// ALl Works will happen happend...................................
async function run () {
    try {
       await client.connect();
       const database = client.db("ClothStore");  
       const ProductsCollect = database.collection("Products"); 
       const OrderCollection = database.collection("Orders"); 
      const UserInformation = database.collection("UserInformation");
      const ReviewCollection = database.collection("ReviewCollection");
      const AdminCollection = database.collection("AdminCollection");

       
   // Geting data from Database API................................
    app.use('/Products', async (req, res)=>{
        const result = await ProductsCollect.find({}).toArray();
        res.send(result);
    })  
       

   // .............................................................
    app.get('/singleProduct/:id', async (req, res)=>{
      const query = {_id: ObjectId(req.params.id)};
      const result = await ProductsCollect.find(query).toArray();
      res.send(result[0]);
    })
   

   // Shipping customer information......... ......................
   app.post('/Shipping', async(req, res) => {
       const result = await OrderCollection.insertOne(req.body);
       res.json(result);
   })


   // Show My Orders On DashBoard..................................
   app.get('/dashboard/myOrders', async (req, res)=> {  
     const query = {email: req.query.email};
     const result = await OrderCollection.find(query).toArray();
     res.send(result);
   })


   // Show Manage orders On DashBoard..............................
   app.get('/dashboard/manageOrder', async (req, res)=> {  
     const result = await OrderCollection.find({}).toArray();
     res.send(result);
   })


   // delete products from myOrder.................................
   app.delete('/dashboard/myOrders/:key', async (req, res)=>{
    const key = req.params.key;
    const result = await OrderCollection.deleteOne({key});
    res.send(result);
   })

   
   // Updatating Status.....bdd.....................................
   app.put('/dashboard/manageOrder/approved/:id', async (req, res) => {
       console.log(req.body);
       const filter = {_id: ObjectId(req.params.id)};
       const result = await OrderCollection.updateOne(filter, {
           $set:{status: 'Approved'}
       });
       res.send(result);
   })


  // resgisteratiuon information is storeing firebase & also my database mongobd......
   app.post('/signup/userInfo', async (req, res)=>{
       console.log(req.body);
      const result = await UserInformation.insertOne(req.body)
      res.send(result);
   })


   // make admin by email address......................................
   app.put('/makeAdmin', async (req, res)=>{
     const filter = {email: req.body.email};
     const result = await UserInformation.updateOne(filter,{
         $set: {role: 'admin', name: req.body.name}
     });
     res.send(result);
   })
   


   // Add  review.................. 
   // review products......... ......................
   app.post('/reviewInserting', async (req, res) => {
    const result = await ReviewCollection.insertOne(req.body);
    res.json(result);
  })
  
  // show review on ui review section.................... 
  app.get('/reviews', async (req, res)=> {  
    const result = await ReviewCollection.find({}).toArray();
    res.send(result);
  })


  // inserting Services on database................ 
  app.post('/addServiceInserting', async (req, res) => {
    const result = await ProductsCollect.insertOne(req.body);
    res.json(result);
  })

  

  // Show admins in makeadmin page....................................
  app.get('/admin', async (req, res)=>{
    //  console.log(query);
    const result = await UserInformation.find({}).toArray();
    res.send(result);

    //  const query = req.body.role;
    //  if(query?.role === 'admin'){
    //   const result = await UserInformation.find({}).toArray();
    //    res.send(result);
    //    console.log(result);
    //   }

   })


  app.get('/checkAdmin/:email', async(req, res)=>{
    const query = {email : req.params.email}; 
    const user = await UserInformation.findOne(query);
    let isAdmin = false;
    if(user?.role === 'admin'){
      isAdmin = true;
    }
    res.send({admin: isAdmin});
  })

  

  
  // manage Products on admin dashboard.................................
  app.get('/productManagement', async (req, res)=> {  
    const result = await ProductsCollect.find({}).toArray();
    res.send(result);
  })


  // Delete Products from Admin DashBoard........................
  app.delete('/productManagement/:key', async (req, res)=> {
    const key = req.params.key;
    const result = await ProductsCollect.deleteOne({key});
    console.log(result);
    res.send(result);
  })


  






    // Show products in shipping page................... ..
    // app.get('/ConfirmOrder/:id', async (req, res)=> {
    //   const id = {_id : ObjectId(req.params.id)};
    //   console.log(req.params.id);
    //   const result = await OrderCollection.find(id).toArray();
    //   console.log(result);
    //   res.send(result[0]);
    // }) 





   // const checkdata = await  ProductsCollect.findOne(query);
   // if(checkdata){
   //    res.json('Product ALready Exist!');
   // }else{
   //   const result = await ProductsCollect.insertOne(query);
   //   res.send(result[0]);
   // }



    
    // // Inserting Product to OrderCollection........... 
    // app.post('/addToCart', async (req, res)=>{
    //     const query = {key:req.body.key}
    //     const checkdata = await  OrderCollection.findOne(query);
    //     if(checkdata){
    //        res.json('Product ALready Exist!');
    //     }else{
    //      const result = await OrderCollection.insertOne(req.body);
    //      res.send(result);
    //     }
    // })



    // // Getting OrderCollection Data for Showing annother Route. 
    // app.get('/orderCollection/:email', async (req, res)=>{ 
    //     const email = { email: req.params.email };
    //       const result = await OrderCollection.find(email).toArray();
    //       res.send(result);
    //     }
    // )


    // // Cancel Product from Order List...............
    // app.delete("/deleted/:key", async (req, res) => {
    //    const key = req.params.key;
    //    const result = await OrderCollection.deleteOne({key});
    //     res.send(result);
    //   });

    

    // // Get User information......................... 
    // app.post('/placeorder', async (req, res) =>{
    //     // console.log(req);
    //     const result = await confirmOrders.insertOne(req.body);
    //     console.log(result);
    //     res.send(result);
    // })


    // // get Confirm Order Information.
    // app.get('/confirmorder', async (req, res) =>{
    //     const result = await confirmOrders.find({}).toArray();
    //     console.log(result);
    //     res.send(result);
    // })


    // // Add New Services To Database............... 
    // app.post('/addServiceDB', async (req, res) =>{
    //   const result = await ProductsCollect.insertOne(req.body);
    //   res.send(result);
    // })




    // // ADmin Pannel................ 
    // app.get('/adminPannel', async (req, res)=>{
    //     console.log('From admin pannel', req.body)
    //     const result = await confirmOrders.find({}).toArray();
    //     console.log(result);
    //     res.send(result);
    // })


    // // Delete Items from the ADmin pannel.............  
    // app.delete('/adminPannel/:key', async (req, res)=>{
    //     const query = {key: req.body.key};
    //     console.log(query);
    //     const result = await confirmOrders.deleteOne(query);
    //     res.send(result);
    // })


    // //
    // app.put('/adminPannel/approved/:id', async (req, res)=>{
    //     const query = {_id: ObjectId(req.params.id)}
    //     // console.log(query);
    //     // const updateStatus = req.body;
    //     const result = await confirmOrders.updateOne(query, {
    //         $set:{
    //             status: 'Approved'
    //         }
    //     });
    //     console.log(result);
    //     res.send(result);
    // })
    

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