const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = 4000;
const users = require("./users.json");
const cars = require("./cars.json");
const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {
  const user = users.find((user) => user.username === req.body.username);

  //   if (!user)
  //     return res.status(401).json({ message: "This user does not exist!" });

  //   if (!user.password === req.body.password)
  //     return res.status(401).json({ message: "Password supplied is incorrect!" });

  //   const token = jwt.sign({ userID: user.id }, "wiqernnadfare", {
  //     expiresIn: "30m",
  //   });

  if (user) {
    if (user.password === req.body.password) {
      const token = jwt.sign({ userID: user.id }, "wiqernnadfare", {
        expiresIn: "30m",
      });

      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Password is incorrect!" });
    }
  } else {
    res.status(401).json({ message: "This user does not exist!" });
  }
});

function checkToken(req, res, next) {
  const token = req.headers["x-access-token"];

  if (!token) return res.status(401).json({ message: "You're not logged in!" });
  jwt.verify(token, "wiqernnadfare", (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "No access!" });
      return;
    } else {
      req.userID = decoded.userID;
      next();
    }
  });

  //   if (token) {
  //     jwt.verify(token, "wiqernnadfare", (err, decoded) => {
  //       if (err) {
  //         res.status(401).json({ message: "No access!" });
  //         return;
  //       } else {
  //         req.userID = decoded.userID;
  //         next();
  //       }
  //     });
  //   } else {
  //     res.status(401).json({ message: "Access Denied" });
  //   }
}

app.get("/data", checkToken, (req, res) => {
  const filtered = cars.filter((car) => car.userID === req.userID);
  res.status(200).json({ data: filtered });
});

app.listen(PORT, () => {
  console.log("Express server started on PORT: " + PORT);
});
