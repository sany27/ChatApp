require('dotenv').config();
const express = require('express');
const http = require('http');

const cors = require('cors')
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});
const bcrypt = require('bcrypt');
const salt = 8;
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const mysql = require('mysql');
const port = 8080;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'chatapp'
});

connection.connect(function (err) {
  if (err) {
    console.log("Connection not created", err);
  }
  console.log('connected as id ' + connection.threadId);
});

io.on("connection", (socket) => {
  console.log("user connected");
  console.log("Socket Id: ", socket.id);
// Join room
  socket.on("joinRoom", (data) => {
    reciever_id = data.reciever;
    sender_id = data.sender;
    const room = [reciever_id, sender_id].sort().join('-');
    socket.join(room);
    const count = io.sockets.adapter.rooms.get(room).size;
    console.log('usercount join room', count);

    // Send msg
    socket.on("message", (data) => {
      console.log('send message room', room);
      io.to(room).emit("NewMessage", data);
    });

    socket.on("userConnection", () => {
      socket.join(room);
      io.to(room).emit("room", room, () => {
        console.log("Message emitted to room:", room);
      });
    });
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  })
});

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', "");
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.KEY);
    const query = `select name,email,address,userType from registereduser where email = ?`;
    connection.query(query, [decoded?.email], (err, results) => {
      if (err) {
        return res.status(200).json({
          status: false,
          message: "internal server error"
        })
      }
      if (!results) {
        return res.status(500).json({
          status: false,
          message: "token not identified",
        })
      }
    })
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
// Register User
// Insert into the table
app.post("/user", async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    // Ensure all required fields are present
    if (!name || !email || !address || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    const encryptedPassword = await bcrypt.hash(password, salt);
    const result = "INSERT INTO registereduser (name, email,password,address) VALUES (?,?,?,?)"
    const data = [name, email, encryptedPassword, address];
    connection.query(result, data, (err, results) => {
      if (err) {
        return res.status(502).json({
          success: false,
          message: "User registered successfully"
        });
      }
      return res.status(200).json({
        success: true,
        message: results
      });
    });

  } catch (err) {
    console.log('error');
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

app.patch("/user/:IDs", (req, res) => {
  const { IDs } = req.params;
  const { name, email, address, userType } = req.body;
  const data = ` UPDATE registereduser set name = ?,email =?, address = ? ,userType = ? where Ids = ?`
  const value = [name, email, address, password, userType, IDs]

  connection.query(data, value, (err, result) => {
    if (err) {
      console.log(err.message);
    }
    else {
      console.log(result);
      return res.status(202).json({
        success: true,
        message: result
      })
    }

  })
})

// read all the users from table
app.get("/user", verifyToken, (req, res) => {
  try {

    const data = `SELECT *  from registereduser`;

    connection.query(data, function (err, result) {
      if (err) {
        console.log(err);
      }
      else {

        // console.log(result);
        return res.status(202).json({
          success: true,
          users: result,
        });
      }
    });

  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});
// get the user by name
app.get("/user/:IDs", (req, res) => {
  try {
    const { IDs } = req.params;
    const data = `Select  name, email,address,userType from registereduser where IDs = ?`


    connection.query(data, [IDs], (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result);
        return res.status(200).json({
          success: true,
          message: result
        })
      }
    })

  } catch (err) {
    res.status(400).json({
      status: false
    })
  }
});

// delete from the table

app.delete("/user/:IDs", (req, res) => {
  try {
    const { IDs } = req.params;
    const data = `DELETE FROM registereduser  where IDs = ?`;
    connection.query(data, [IDs], (err, result) => {
      if (err) {
        console.log(err.message);
      }
      else {
        console.log(result);
        return res.status(200).json({
          success: true,
          message: result
        })
      }
    })
  } catch (err) {
    res.status(300).json({
      messgae: err,
      success: false
    })
  }

});
// Login User

app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    console.log(password)

    const query = 'select * from registereduser where email = ? ';

    connection.query(query, [email], (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(results);

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found!'
        });
      }
      const user = results[0];


      // compare password
      const comparison = bcrypt.compare(password, user.password)
      if (!comparison) {
        return res.status(200).json({
          success: false,
          message: 'Incorrect password'
        })
      }
      user_info = {
        id: user.IDs,
        name: user.name,
        email: user.email,
        address: user.address,
        userType: user.userType,

      }

      const token = jwt.sign(
        { user: user_info },
        process.env.KEY,
        { expiresIn: '1h' }


      )



      return res.status(200).json({
        success: true,
        message: 'Login successfull!',
        token: token,
        data: user_info
      });
    })
  } catch (err) {
    res.json({
      success: false,
      message: err
    })
  }
})



app.get("/", (req, res) => {
  console.log("Root is Working !")
  res.send("Working");
});


server.listen(port, () => {
  console.log("Server is listening to port", port);
})