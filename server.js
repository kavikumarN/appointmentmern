import express from 'express';
import mongoose from "mongoose";
import Cors from 'cors';
import UserDetails from './UsersDetail.js';
import * as cron from 'node-cron';
import axios from 'axios';
import request from 'request';

const API_KEY = "bhiveworkspace2";
const sid = "bhiveworkspace2";
const subdomain = "@https://api.exotel.com";
const callerId = '08047185984';
const API_TOKEN = "9187d29bb15787a18442903af00ffe10b1f71ef5";
var app = express()
var port = process.env.PORT || 8080
var obj = {};

const r = x => Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')


app.use(express.json())
app.use(Cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); // allowed actiosn
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next(); // call next middlewer in line
});
var Connection_url = 'mongodb+srv://bhiveapp:bhive@123@cluster0.wfubap6.mongodb.net/bhiveaif?retryWrites=true&w=majority';
mongoose.connect(Connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const initCall2 = async (from, to) => {
const url = "https://" + API_KEY + ":" + API_TOKEN + "@api.exotel.com/v1/Accounts/" + sid + "/Calls/connect.json"
console.log('URL'); 
console.log(url);
    axios.post(url,
        r({
            "From": to.toString(),
            // "To": to.toString(),
            "CallerId": callerId.toString(),
            "CallerType": 'trans',
             "Url" :'http://my.exotel.com/Exotel/exoml/start_voice/401276',
        }),
        {
            withCredentials: true,
            headers: {
                "Accept": "application/x-www-form-urlencoded",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        },
    )
        .then((res) => {
            console.log('status check');
            updateReminderStatus(to, "Reminder Executed", function (req, res) {
                return true;
            });
            console.log(res);
            return true;
        }) 
        .catch((error) => {
            if(error)
           if(error.response.status === 403) {
            console.log(error);
            updateDndStatus(to, "Failed to Execute Reminder due to DND", function (req, res) {
                return true;
            });
           
        }
        else{
            updateReminderStatus(to, "Failed to Execute Reminder", function (req, res) {
                return true;
            });
        }
        })

}


    const updateReminderStatus = (where, payload, cb) => {
    try {
        UserDetails.findOneAndUpdate({ Phone: where }, { $set: { Notes: payload } }, function (err, data) {
            if (err) {
                res.status(501).send(err)
            }
            cb();
        })
    } catch (error) {
        console.error(error);
        return false;
    }
};

const updateDndStatus = (where, payload, cb) => {
    try {
        UserDetails.findOneAndUpdate({ Phone: where }, { $set: { Notes: payload } }, function (err, data) {
            if (err) {
                res.status(403).send(err)
            }
            cb();
        })
    } catch (error) {
        console.error(error);
        return false;
    }
};
const scheduler = (fn, time, Cr_at, Phone) => {
    fn = cron.schedule(time, () => {
        console.log('Running a scheduled Exotel call at ' + Date.now());
        console.log('task_' + Cr_at);
         initCall2(callerId, Phone);
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
    fn.start();
    updateReminderStatus(Phone, "Reminder has been scheduled", function (req, res) {
        console.log('function starts');
        console.log(fn);
        return true;
    });
    return true;
}

const scheduleTask = async (task) => {
    var date = new Date(task.Time);
    var secs = date.getSeconds();
    var mins = date.getMinutes();
    var hour = date.getHours();
    var dayofmonth = date.getDate();
    var month = date.getMonth() + 1;
    var dayofweek = date.getDay();
    var cronformat_time = secs + ' ' + mins + ' ' + hour + ' ' + dayofmonth + ' ' + month + ' ' + dayofweek;
    console.log(cronformat_time);
    var funct;
    scheduler(funct, cronformat_time, task.Cr_at, task.Phone);
    return cronformat_time;
}

app.get("/", function (req, res) {
    res.send("test sucess");
})

app.get("/details", function (req, res) {
    try {
        UserDetails.find().sort({ Cr_at: -1 }).limit(20).find(function (err, data) {
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
    console.log('api call');
    const dbdata = req.body
    try {
        UserDetails.create(dbdata, (err, data) => {
            if (err) {
                res.status(501).send(err)
            }
            else {
                scheduleTask(data);
                console.log("post success data");
                console.log(data);
                res.status(201).send(data)
            }
        })
    } catch (error) {
        console.log(error);
    }
})
    app.post("/delete", function (req, res) {
        console.log('delete api');
    const dbdata = req.body
    var myquery = { Phone: dbdata.Phone };
    try {
    UserDetails.deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("document deleted");
    });
} catch(error) {
    console.log(error);
}
});

app.post("/update", function (req, res) {
    const dbdata = req.body
    var myquery = { Phone: dbdata.Phone };
    try{
    UserDetails.updateOne(myquery, function (err, obj) {
        if (err) throw err;
        console.log("document updated");
    });
} catch{
    console.log(error);
}
});
app.listen(port)
