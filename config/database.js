const mongoose = require('mongoose');
const url = process.env.MONGO_URL

const mongoDB = async()=>{
    try {
        const data = await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        })
        console.log('database successfully connected in '+data.connection.host);
        
    } catch (error) {
        console.log('error in connect in database');
    }
}

module.exports = mongoDB