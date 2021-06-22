require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const db = require("./database/client");

app.use(express.json());

// define get request at home route, display all the users
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id ASC;")
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res.sendStatus(500);
    });
});

// define get request with user id, display user where id matches the param
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const findUserById = {
    text: `
    SELECT * 
    FROM users 
    WHERE id=$1;
    `,
    values: [id],
  };

  db.query(findUserById)
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500));
});

// define post request
app.post("/api/users", (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  const createNewUser = {
    text: `
  INSERT INTO users 
  (first_name, last_name, age, active)
  VALUES ($1,$2,$3,$4)
  RETURNING *;
  `,
    values: [first_name, last_name, age, active],
  };
  db.query(createNewUser)
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.sendStatus(500));
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
