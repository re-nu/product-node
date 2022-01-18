import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import {ObjectId} from 'bson';
import cors from 'cors';

dotenv.config()

const app=express();

const PORT=process.env.PORT;
app.use(cors());
app.use(express.json());


const MONGO_URL=process.env.MONGO_URL;

async function createConnection() {
    const client=new MongoClient(MONGO_URL);
    await client.connect();

    console.log("Mongodb connected ");
    return client;
}

const client=await createConnection();



app.get("/",(request,response)=>{
    response.send("welcome to products");
})

app.post("/products",async(request,response)=>{
    const products=request.body
    const result= await creatProducts(products)
    response.send(result)
})

app.post("/product",async(request,response)=>{
    const product=request.body
    const result=await addProduct(product)
    response.send(result);
})

app.get("/products",async(request,response)=>{
    const products=await getAllProducts();
    response.send(products);
})

app.get("/product/:_id",async(request,response)=>{
    const {_id}=request.params
    console.log(_id)
    const product = await getProductById(_id)
    response.send(product)
})

app.put("/product/:_id",async(request,response)=>{
    const{_id}=request.params
    const product=request.body
    const result=await editProduct(_id, product)
    const UpdatedProduct= await getProductById(_id);
    response.send(UpdatedProduct);
})

app.delete("/product/:_id",async(request,response)=>{
    const {_id}=request.params
    const result=await client.db("b28wd").collection("products").deleteOne({_id:ObjectId(_id)})
    response.send(result);
})

app.listen(PORT,()=>console.log("App started in ",PORT))

async function editProduct(_id, product) {
    return await client.db("b28wd").collection("products").updateOne({ _id: ObjectId(_id) }, { $set: product });
}

async function addProduct(product) {
    return await client.db("b28wd").collection("products").insertOne(product);
}

async function getProductById(_id) {
    return await client.db("b28wd").collection("products").findOne({ _id: ObjectId(_id) });
}

async function getAllProducts() {
    return await client.db("b28wd").collection("products").find({}).toArray();
}

async function creatProducts(products) {
    return await client.db("b28wd").collection("products").insertMany(products);
}
