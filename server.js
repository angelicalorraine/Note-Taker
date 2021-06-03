const express = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');
const dbPath = '/db/db.json';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, dbPath));
});

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, dbPath), "utf8", function (error, response) {
        if (error) {
            console.log(error);
        }
        const notes = JSON.parse(response);
        const noteRes = req.body;
        const noteID = uniqid();
        const newNote = {
            id: noteID,
            title: noteRes.title,
            text: noteRes.text,
        }
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, dbPath), JSON.stringify(notes, null, 2), function (err) {
            if (err) throw err;
        });
    });
});

//Delete Note 


app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));