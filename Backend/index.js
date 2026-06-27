// const dns = require('dns');
// dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const app = express();
// const userRoutes = require('./routes/authRoutes');
app.use(express.json());
require('dotenv').config();
const cors = require('cors');
// http://localhost:5713
app.use(cors());
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
      console.log("Database connected");
}).catch((error) => {
      console.log("Database connection failed error: ", error);
});

// app.use("/auth", userRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
});

