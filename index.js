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
      res.status(500).send(e.message);
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
    .then((data) => {
      if (!data.rows.length) {
        return res
          .status(404)
          .send("The order you are looking for does not exist.");
      }
      res.json(data.rows);
    })
    .catch((e) => res.status(500).send(e.message));
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
    .catch((e) => res.status(500).send(e.message));
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;

  const updateUserById = {
    text: `
    UPDATE users 
    SET first_name=$1, last_name=$2,age=$3, active=$4
    WHERE id=$5
    RETURNING *;
    `,
    values: [first_name, last_name, age, active, id],
  };
  db.query(updateUserById)
    .then((data) => res.json(data.rows))
    .catch((e) => {
      res.status(500).send(e.message);
    });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const deleteUserById = {
    text: `
    DELETE FROM users
    WHERE id=$1
    RETURNING *;
    `,
    values: [id],
  };
  db.query(deleteUserById)
    .then((data) => {
      if (!data.rows.length) {
        return res
          .status(404)
          .send("The user you are trying to delete does not exist");
      }
      res.json(data.rows);
    })
    .catch((e) => res.status(500).send(e.message));
});

app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id ASC;")
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res.status(500).send(e.message);
    });
});

// define get request with order id, display order where id matches the param
app.get("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const findOrderById = {
    text: `
    SELECT * 
    FROM orders 
    WHERE id=$1;
    `,
    values: [id],
  };

  db.query(findOrderById)
    .then((data) => {
      if (!data.rows.length) {
        return res
          .status(404)
          .send("The order you are looking for does not exist.");
      }
      res.json(data.rows);
    })
    .catch((e) => res.status(500).send(e.message));
});

// define post request
app.post("/api/orders", (req, res) => {
  let { price, user_id } = req.body;

  const createNewOrder = {
    text: `
  INSERT INTO orders 
  (price, date, user_id)
  VALUES ($1,CURRENT_TIMESTAMP,$2)
  RETURNING *;
  `,
    values: [price, user_id],
  };
  db.query(createNewOrder)
    .then((data) => res.status(201).json(data.rows))
    .catch((e) => res.status(500).send(e.message));
});

app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { price, user_id } = req.body;

  const updateOrderById = {
    text: `
    UPDATE orders
    SET price=$1, date=CURRENT_TIMESTAMP,user_id=$2
    WHERE id=$3
    RETURNING *;
    `,
    values: [price, user_id, id],
  };
  db.query(updateOrderById)
    .then((data) => res.json(data.rows))
    .catch((e) => {
      res.status(500).send(e.message);
    });
});

app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;

  const deleteOrderById = {
    text: `
    DELETE FROM orders
    WHERE id=$1
    RETURNING *;
    `,
    values: [id],
  };
  db.query(deleteOrderById)
    .then((data) => {
      if (!data.rows.length) {
        return res
          .status(404)
          .send("The order you are trying to delete does not exist");
      }
      res.json(data.rows);
    })
    .catch((e) => res.status(500).send(e.message));
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
