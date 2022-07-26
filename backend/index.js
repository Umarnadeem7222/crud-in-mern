const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const mongoose = require("mongoose");
const PhoneBook = require('./models/schema')

const app = express();



app.use(bodyParser.json());

app.use(cors(corsOptions));

var corsOptions = {
    origin: "http://localhost:3000"
  };





mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})



app.listen(3000,function(){
    console.log('we are on');
  });




 



app.post("/addnumber", (req, res) => {
    console.log('hello world')
    const number = new PhoneBook({
        name: req.body.name,
        phone: req.body.phone,
    });
    number.save().then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json({message:err})
    });
});


app.get("/getall", async (req, res) => {
    console.log('getting all');
    const phoneNumbers = await PhoneBook.find({})
    try{
        res.status(200).json({
            status : 'Success',
            data : {
                phoneNumbers
            }
        })
    }catch(err){
        res.status(500).json({
            status: 'Failed',
            message : err
        })
    }

}); 

app.get('/get/:id', (req, res) => {

    console.log('id in');

    const id = req.params.id;
    PhoneBook.findById(id , function(err, number){
        if(err){
            res.json(err)
        }
        else{
            res.json(number)
        }
    })
});

app.post('/update/:id', (req, res) => {
    PhoneBook.findById(req.params.id, function(err, number){
        if(!number){
            res.status(404).send("data not found")
        }
        else{
            number.name = req.body.name
            number.phone  = req.body.phone

            number.save().then(todo=>{
                res.json('number has been updated')
            }).catch(err=>{
                res.status(404).send("update not possible")
            })
        }
    })
});

app.delete('/delete/:id', (req, res) => {
    PhoneBook.findByIdAndDelete(req.params.id, function(err,number){
        if(err){
            res.status(404).send("number is not deleted")
        }else{
           res.json("number has been deleted");
        }
    })
});

