const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys_dev');
require("dotenv").config();
const morgan = require('morgan');//alows you see routes requested in the console. goog for development
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');//enables api to handle request from different origin
const expressValidator = require('express-validator');

//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');

//init express
const app = express();

//db connection
mongoose.connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true//prevents deprecation warning
}).then(() => console.log("Database connected"))
.catch(err => console.log(err));
    

//middlewares
app.use(morgan("dev"));//displays routes being called in the console
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());


//routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

//port
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});