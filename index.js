const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path')
app.use(cors())
app.use(express.json())
require('./config/mongoose')()
app.use("/images", express.static(path.join("images")))
const PORT = process.env.PORT || 5000;
const Router = require('./router')
app.use(Router)




app.listen(PORT, () => { console.log(`Server is running on port ${PORT}...`); })