const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const session = require("express-session"); 
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cors = require('cors');

require("dotenv").config();

// Route handlers
const authRoute = require("./routes/api/AuthRoute");
const userRoutes = require("./routes/api/users");
const loginRoutes = require("./routes/api/login");
const DriverLoginRoutes = require("./routes/api/driverslogin");
const restaurantRoutes = require("./routes/api/restaurants");
const menuItemRoutes = require("./routes/api/menuItems");
const cartRoutes = require("./routes/api/cart");  
const completedCartRoutes = require('./routes/api/CompletedCarts');
const restaurantreviews = require('./routes/api/reviewForm');
const addDriver = require('./routes/api/drivers');
const code = require('./routes/api/code');
const driverReviews = require('./routes/api/DriverReviewForm');
const routeHandler = require('./routes/api/route');
const locationHandler = require('./routes/api/location');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false, 
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

app.use("/", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menuItems", menuItemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/CompletedCarts', completedCartRoutes);
app.use('/api/reviewForm', restaurantreviews);
app.use('/api/drivers', addDriver);
app.use('/api/driverslogin', DriverLoginRoutes);
app.use('/api/code', code);
app.use('/api/DriverReviewForm', driverReviews);
app.use('/api/route', routeHandler);
app.use('/api/location', locationHandler);

app.use('/restaurant_assets', express.static('restaurant_assets'));
app.use('/menuItem_assets', express.static('menuItem_assets'));

app.get('/', (req, res) => {
  if(req.session.name) {
    return res.json({valid:true, name: req.session.name, email: req.session.email, university: req.session.university, _id: req.session.id});
  } else {
    return res.json({valid:false});
  }
});

// Connect Database
connectDB();

const port = process.env.PORT || 8082;
server.listen(port, () => console.log(`Server running on port ${port}`));
