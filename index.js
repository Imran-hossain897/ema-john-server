const express = require('express')
const MongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e30mt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 5000

app.get('/', (req, res)=>{
    res.send('hello')
})



const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");


app.post('/addProduct', (req, res)=>{
    const products = req.body
    productsCollection.insertOne(products)
    .then(result=>{
        res.send(result.insertedCount)
    })
})

app.get('/products', (req, res)=>{
    productsCollection.find({}).limit(20)
    .toArray((err, document)=>{
        res.send(document)
    })
})

app.get('/product/:key', (req, res)=>{
    productsCollection.find({key: req.params.key})
    .toArray((err, document)=>{
        res.send(document[0])
    })
})
app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys} })
    .toArray( (err, documents) => {
        res.send(documents);
    })
})

app.post('/addOrder', (req, res)=>{
    const products = req.body
    ordersCollection.insertOne(products)
    .then(result=>{
        res.send(result.insertedCount >0)
    })
})

});


app.listen(process.env.PORT || port)