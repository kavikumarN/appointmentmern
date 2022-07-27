import express from 'express'
import mongoose from "mongoose"
import Cors from 'cors'
import UserDetails from './Users.js'

var app = express()
var port = process.env.PORT || 8080 

app.use(express.json())
app.use(Cors())

var Connection_url = 'mongodb+srv://bhiveapp:bhive@123@cluster0.wfubap6.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(Connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


app.get("/", function (req, res){
    res.send( "test sucess");
})

app.get("/details", function (req, res) {
    
    try {
        UserDetails.find((err, data) => {
        if (err) {
            res.status(501).send(err)
        }
        else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(data)
        }
    })
    } catch (error) {
        console.log(error);
    }
})

app.post("/details", function (req, res) {

    const dbdata = req.body
    try {
        UserDetails.create(dbdata, (err, data) => {
        if (err) {
            res.status(501).send(err)
        }
        else {
            res.status(201).send(data)
        }
    })
    } catch (error) {
        console.log(error);
    }
})





app.listen(port)
