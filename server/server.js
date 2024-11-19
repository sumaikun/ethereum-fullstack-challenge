//Config express
const express = require("express");
const dotenv = require("dotenv");
const process = require("process");
const workoutRoutes = require("./routes/workouts.js");
const usersRoutes = require("./routes/users.js");
const transactionsRoutes = require("./routes/Transactions.js");
const userPortfolio = require("./routes/userPortfolio.js");
const nftRoutes = require('./routes/nftRoutes.js');
const walletLogsRoutes = require('./routes/walletLogsRoutes.js');
const ipfsRoutes = require('./routes/ipfsRoutes.js');
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();

// configuration cors
const corsOptions = {
  origin: ["http://localhost:5173", "https://api.coingecko.com/"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// middleware pour parser le json
app.use(express.json());

// middleware pour logger les requetes
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/workouts/", workoutRoutes);
app.use("/api/portfolio/", userPortfolio);
app.use("/api/transactions/", transactionsRoutes);
app.use("/api/users/", usersRoutes);
app.use('/api/nfts/', nftRoutes);
app.use('/api/wallet-logs/', walletLogsRoutes);
app.use('/api/ipfs/', ipfsRoutes)

console.log('process.env.MONG_URI',process.env.MONG_URI);

//connect to db et lancement du server
mongoose
  .connect(process.env.MONG_URI)
  .then(() => {
    // listen requests
    console.log(`connected to db`);
  })
  .catch((error) => {
    console.log("db error",error);
  });

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
