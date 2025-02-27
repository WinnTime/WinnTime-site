//const api= https://api.winnipegtransit.com/v3/stops/' + LStop + '/schedule.json?api-key=yxCT5Ca2Ep5AVLc0z6zz';

const express = require("express");
const app = express();
const tracker = require("./routes/stopSchedule");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(express.static("./public"));

app.use(cors());
const port = 3500;

app.use("/api/v1/tracker", tracker);

const start = async () => {
  try {
    app.listen(port, () => {
      console.log(`Server is listening to port ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();