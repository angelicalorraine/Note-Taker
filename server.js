const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');
const dbPath = './db/db.json';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); ``

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));