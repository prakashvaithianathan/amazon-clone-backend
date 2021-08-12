const express = require('express');
const app = express();
app.use(express.json())
const dotenv = require('dotenv')
dotenv.config({path:'./config/.env'})
const cors = require('cors');

app.use(cors());
const mongoDB = require('./config/database')
mongoDB();
const routes = require('./routes')



app.use('/',routes)


app.get('/',(req, res) => {
    res.send('this is home route')
})

app.listen( process.env.PORT || 5000,()=>{
    console.log('server has been started');
})