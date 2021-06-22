require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { Pool, Client } = require("pg");

const db = require("./database/client");

app.use(express.json());

app.get("/api/users", (req, res) => {
  db.query(
    `
  SELECT *
  FROM users
  `,
    (err, data) => {
      if (err) return res.sendStatus(500);
      else res.json(data.rows);
    }
  );
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
