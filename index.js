const express = require('express')
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT || 5000

//middleware 
app.use(cors())
app.use(express.json())

//connect to mongodb


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.voifv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client.db("inventory").collection("items");

    console.log('inside mongodb');

    //using get for load  all data 
    app.get('/inventory', async (req, res) => {

      const query = {}
      const cursor = inventoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)

    })

    //using get for one data 
    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const query = { _id: ObjectId(id) }
      const result = await inventoryCollection.findOne(query)
      res.send(result)
    })



    /*..................
      manage inventory 
    ...................*/

    //using get for load  all data 
    app.get('/manage', async (req, res) => {

      const query = {}
      const cursor = inventoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)

    })

    //using get for one data 
    app.get('/manage/:id', async (req, res) => {
      const id = req.params.id
      // console.log(id)
      const query = { _id: ObjectId(id) }
      const result = await inventoryCollection.findOne(query)
      res.send(result)
    })

    //using delete for remove data
    app.delete('/manage/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await inventoryCollection.deleteOne(query)
      res.send(result)

    })


    /*..................
          update inventory 
        ...................*/
        app.get('/update', async (req, res) => {

          const query = {}
          const cursor = inventoryCollection.find()
          const result = await cursor.toArray()
          res.send(result)
    
        })
    
        //using get for one data 
        app.get('/update/:id', async (req, res) => {
          const id = req.params.id
          // console.log(id)
          const query = { _id: ObjectId(id) }
          const result = await inventoryCollection.findOne(query)
          res.send(result)
        })

    // using update for quantity
    app.put('/update/:id', async (req, res) => {
      const item = req.body
      console.log(item);
      const quantity = parseInt(req.body.quantity)
      const reStockQuantity = quantity + 1;
      const newQuantity = quantity - 1;
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: newQuantity
        },
      };
      const result = await inventoryCollection.updateOne(filter, updateDoc, options);
      res.send(result)

    })
    // using update for add /restock quantity

    // app.put('/inventory/:id',async(req,res)=>{
    //   const item= req.body
    //   console.log(item);
    //   const quantity=parseInt(req.body.quantity)  
    //   const id = req.params.id
    //   console.log(id);
    //   const filter ={_id:ObjectId(id)}
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //     //  quantity : newQuantity
    //     },
    //   };
    //   const result = await inventoryCollection.updateOne(filter, updateDoc, options);
    //   res.send(result)

    // })

    app.get('/myItem', async (req, res) => {
      console.log(req.query.email);
      if (req.query.email) {
        const search = req.query.email.toLowerCase();
        console.log(search);
        const cursor = inventoryCollection.find()
        const result = await cursor.toArray()
        const email = result.filter(r => r?.email === search)
        console.log(email);
        // const match =result.filter(item => item?.email.toLowerCase().includes(search))
        res.send(result)
      }
      else {
        const query = {}
        const cursor = inventoryCollection.find()
        const result = await cursor.toArray()
        res.send(result)


      }


    })






    //using get for one data 

    app.get('/inventory', async (req, res) => {


      const query = {}
      const cursor = inventoryCollection.find()
      const result = await cursor.toArray()
      res.send(result)









    })



    //using post for add data to server
    app.post('/inventory', async (req, res) => {
      const newItem = req.body
      const result = await inventoryCollection.insertOne(newItem)
      res.send(result)
    })


    //using delete to remove data

    // app.delete('/inventory/:id', async (req, res) => {
    //   const id = req.params.id
    //   const query = { _id: ObjectId(id) }
    //   const result = await inventoryCollection.deleteOne(query)
    //   res.send(result)

    // })




  }
  finally {

    //   await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})