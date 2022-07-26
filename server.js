import express from 'express'
import mongoose from "mongoose"
import Cors from 'cors'
import UserDetails from './UserDetails.js'

var app = express()
var port = process.env.PORT || 8080 

app.use(express.json())
app.use(Cors())

var Connection_url = 'mongodb+srv://Rest-API_lmas:<password>@cluster0.gklyj.mongodb.net/<dbname>?retryWrites=true&w=majority'

mongoose.connect(Connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

app.get("/details", function (req, res) {
    
    UserDetails.find((err, data) => {
        if (err) {
            res.status(501).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })

})

app.post("/details", function (req, res) {
    const dbdata = req.body

    UserDetails.create(dbdata, (err, data) => {
        if (err) {
            res.status(501).send(err)
        }
        else {
            res.status(201).send(data)
        }
    })
})



app.listen(port)