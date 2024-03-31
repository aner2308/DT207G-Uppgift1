const { Client } = require("pg");
const express = require("express");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));    //Aktiverar formulärdata

//Anslut till databasen
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect((err) => {
    if (err) {
        console.log("Fel vid anslutning: " + err);
    } else {
        console.log("Ansluten till databasen...");
    }
});

//Routing
app.get("/", async (req, res) => {
    //Läs ut från databasen
    client.query("SELECT * FROM courses ORDER BY id DESC", (err, result) => {
        if (err) {
            console.log("Fel vid db-fråga");
        } else {
            res.render("index", {
                courses: result.rows
            });
        }
    })
});

app.post("/", async (req, res) => {
    const courseCodeEl = req.body.courseCode;
    const courseNameEl = req.body.courseName;
    const progressionEl = req.body.progression;
    const courseUrlEl = req.body.courseUrl;

    //SQL-fråga
    const result = await client.query("INSERT INTO courses(code, coursename, syllabus, progression)VALUES($1, $2, $3, $4)",
        [courseCodeEl, courseNameEl, courseUrlEl, progressionEl]
    );

    res.redirect("/");
});

// Routing för att radera en kurs
app.post("/delete-course", async (req, res) => {
    const courseId = req.body.courseId;

    try {
        // Ta bort kursen från databasen
        await client.query("DELETE FROM courses WHERE id = $1", [courseId]);

        // Skicka tillbaka en bekräftelse
        res.redirect("/");
    } catch (error) {
        console.error("Fel vid radering av kurs:", error);
        res.status(500).send("Något gick fel vid radering av kursen.");
    }
});

//Starta servern
app.listen(process.env.PORT, () => {
    console.log("Servern startad på port: " + process.env.PORT);
});