const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwlhu.mongodb.net/baby_lotion?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://baby_lotion:DB1bbHIe3rZwm5tZ@cluster0.hwlhu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)


async function run() {
    try {
        await client.connect()
        console.log('connect')
        const database = client.db('baby_lotion');
        const serCollection = database.collection('services');
        const purchaseCollection = database.collection('purchases')
        const userCollection = database.collection('users')
        const ratingCollection = database.collection('rating')

        // find all data
        app.get('/services', async (req, res) => {
            const cursor = serCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        // get one data from service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const purchase = await serCollection.findOne(query)
            res.json(purchase)
        })
        // data insert for booking
        app.post('/purchases', async (req, res) => {
            const purchaze = req.body;
            const result = await purchaseCollection.insertOne(purchaze)
            console.log(result)
            res.json(result)
        })
        // all booking data find
        app.get('/purch', async (req, res) => {
            const data = purchaseCollection.find({});
            const serv = await data.toArray();
            res.json(serv)
        })


        // ekta user er jonn find
        app.get('/purchases', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = purchaseCollection.find(query);
            const onePurchase = await cursor.toArray();
            res.json(onePurchase)
        });
        // user create and insert
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await userCollection.insertOne(users)
            console.log(result)
            res.json(result)
        })
        // admin create 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user)
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } }
            const result = await userCollection.updateOne(filter, updateDoc)
            console.log(result)
            res.json(result)
        })

        // find an admin
        app.get('/users/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query)
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        // purchase data theke delete
        app.delete('/purchases/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await purchaseCollection.deleteOne(query)
            console.log('delete user', result)
            res.json(result)
        })
        // rating er jonno insert kora 1 ta data
        app.post('/rating', async (req, res) => {
            const rates = req.body;
            const result = await ratingCollection.insertOne(rates)
            console.log(result)
            res.json(result)
        })
        // find rating
        app.get('/rating', async (req, res) => {
            const ratingData = ratingCollection.find({});
            const rateResult = await ratingData.toArray();
            res.send(rateResult)
            console.log(rateResult)
        })
        // delete purchases data
        app.delete('/purch/:id', async (req, res) => {
            const id = req.params.id;
            const deleteQuery = { _id: ObjectId(id) }
            const results = await purchaseCollection.deleteOne(deleteQuery)
            console.log('deleted', results)
            res.json(results)
        })
        // pending to approved
        app.put('/purch/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const course = {
                $set: {
                    status: 'Approved'
                },
            };
            const result = await purchaseCollection.updateOne(query, course)
            res.json(result)
            console.log(result)
        })
        // again insert data 
        app.post('/services', async (req, res) => {
            const addProduct = req.body;
            const answer = await serCollection.insertOne(addProduct)
            console.log(answer)
            res.json(answer)
        })
        // allservice theke delete
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const deleteQuery = { _id: ObjectId(id) }
            const results = await serCollection.deleteOne(deleteQuery)
            console.log('deleted', results)
            res.json(results)
        })


    }
    finally {
        // await client .close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello world ware!')
})

app.listen(port, () => {
    console.log('running start on port', port)
})