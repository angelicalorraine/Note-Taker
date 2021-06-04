const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
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

app.delete("/api/notes/:id", async (req, res) => {
    let noteDelete = req.params.id;
    let dataFile = path.join(__dirname, dbPath);
    try {
        let data = await fsp.readFile(dataFile);
        let dataArray = JSON.parse(data);
        // iterate array backwards- .splice() doesn't cause to miss elements of the array
        let found = false;
        for (let i = dataArray.length - 1; i >= 0; i--) {
            if (dataArray[i].id === noteDelete) {
                found = true;
                dataArray.splice(i, 1);
            }
        }
        if (found) {
            await fsp.writeFile(dataFile, JSON.stringify(dataArray));
            res.send("Successfully deleted");
        } else {
            res.status(404).send(`Note id ${noteDelete} not found.`);
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));