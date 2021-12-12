const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
module.exports = () => {
    mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log('db connected succesfully');
        })
        .catch(err => {
            console.log(err);
        })
}