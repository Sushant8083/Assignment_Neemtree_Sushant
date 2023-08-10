// index.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const candidateController = require('./controllers/candidateController');

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/projectdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('excelFile'), candidateController.uploadExcel);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
