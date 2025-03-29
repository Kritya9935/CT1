const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const EmployeeModel = require('./models/Employee');
const HomeModel = require('./models/Home');
const { Parser } = require('json2csv');
const moment = require ('moment-timezone');
const crypto = require('crypto');
const path = require('path');


const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: '*', // Sab devices allow
  methods: ['GET', 'POST'],
  credentials: true
}));

// mongoose.connect("mongodb://127.0.0.1:27017/employee");

// mongoose.connect("mongodb+srv://Kashish:Cycle@cyclecluster.gx0yx.mongodb.net/cycletime?retryWrites=true&w=majority&appName=CycleCluster",{
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://Kashish:Cycle@cyclecluster.gx0yx.mongodb.net/cycletime?retryWrites=true&w=majority&appName=CycleCluster", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

.then(() => console.log("MongoDB connected Successfully"))
.catch(err => console.log("connection failed" , err));

//random generate password
function generatePassword(length = 8) {
  return crypto.randomBytes(length).toString('hex').slice(0,length);
}

//Admin creates user
app.post('/admin/create-user', async (req,res) => {
  const {email,isAdmin} = req.body;  //isAdmin to check if request is from admin
  console.log('Received request:', req.body);

  if(!email){
    return res.status(400).json({ error : 'Email is required'});
  }

  //For simplicity, assume only admin can hit this endpoint (add proper auth later)
  try {
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const userId = `USER${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const password = generatePassword();
    const newUser = { email, userId, password, isAdmin: false }; // Normal user, not admin
    console.log('Creating user:', newUser);
    const user = await EmployeeModel.create(newUser);
    res.json({ message: 'User created successfully', userId, password });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user', details: err });
  }
});

app.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  console.log('Login request:', req.body); // Debug log
  try {
    const user = await EmployeeModel.findOne({ userId });
    if (user) {
      if (user.password === password) {
        res.json({ message: 'success', userId: user.userId, isAdmin: user.isAdmin });
      } else {
        res.json({ error: 'Wrong password' });
      }
    } else {
      res.json({ error: 'No record existed' });
    }
  } catch (err) {
    console.error('Login error:', err); // Debug log
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

app.post('/home', async (req, res) => {

  req.body.createdAt = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

  const greaterCycleTime1 = Math.max(parseFloat(req.body.cycleTime1_OCT), parseFloat(req.body.cycleTime1_MCT));
  const cycleTimes = [
    greaterCycleTime1,
    parseFloat(req.body.cycleTime2),
    parseFloat(req.body.cycleTime3),
    parseFloat(req.body.cycleTime4),
    parseFloat(req.body.cycleTime5)
  ];

  function calculateAverageCycleTimes(cycleTimes) {
    const validCycleTimes = cycleTimes.filter(time => typeof time === 'number' && !isNaN(time));
    const total = validCycleTimes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const average = validCycleTimes.length > 0 ? total / validCycleTimes.length : 0;
    return average;
  }

  const averageCycleTime = calculateAverageCycleTimes(cycleTimes);

  const greaterValue = Math.max(parseFloat(req.body.number_of_devices), parseFloat(req.body.number_of_man_power), parseFloat(req.body.number_of_machine_jigs));
  const finalAverage = averageCycleTime / parseFloat(req.body.number_of_station) / greaterValue;

  const uph = 3600/finalAverage;

  req.body.average_CT = averageCycleTime;
  req.body.final_average = finalAverage;
  req.body.uph =  uph;

  HomeModel.create(req.body)
    .then(home => res.json(home))
    .catch(err => res.json(err));
});

// Endpoint to export data as CSV filterd by date

app.get('/export-home-csv', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if(!startDate || !endDate){
      return res.status(400).json({ error: 'please provide both startDate and endDate' });
    }
    
    const start = moment(startDate, 'YYYY-MM-DD').tz('Asia/Kolkata').startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const end = moment(endDate, 'YYYY-MM-DD').tz('Asia/Kolkata').endOf('day').format('YYYY-MM-DD HH:mm:ss');


    console.log("Filtering data from:", start, "to:", end); // Debugging log

    const homes = await HomeModel.find({
      createdAt:{
        $gte: start,
        $lte:end
      }
    }).lean().exec();

    if (homes.length === 0) {
      return res.status(404).json({ error: 'No data found for the selected  date range' });
    }

    const csvData = [];
    homes.forEach(home => {
      const greaterValue = Math.max(home.number_of_devices, home.number_of_man_power,  home.number_of_machine_jigs);
    

    // Row for OCT
    const octCycleTimes = [
      home.cycleTime1_OCT,
      home.cycleTime2,
      home.cycleTime3,
      home.cycleTime4,
      home.cycleTime5,
    ].filter(time => time !== undefined && !isNaN(time));
    const octAvg = octCycleTimes.length > 0 ? octCycleTimes.reduce((a, b) => a + b, 0) / octCycleTimes.length : 0;
    const octFinalAvg = octAvg / home.number_of_station / greaterValue;
    const octUph = octFinalAvg ? 3600 / octFinalAvg : 0;

    csvData.push({
      STATION_NO: home.station_no,             
        STATION_NAME: home.station_name,           
        "OCT/MCT": "OCT",
        VALUE: home.cycleTime1_OCT,               
        CYCLETIME2: home.cycleTime2,               
        CYCLETIME3: home.cycleTime3,               
        CYCLETIME4: home.cycleTime4,               
        CYCLETIME5: home.cycleTime5,              
        AVERAGE_CT: octAvg,                       
        NUMBER_OF_STATION: home.number_of_station, 
        NUMBER_OF_DEVICES: home.number_of_devices, 
        NUMBER_OF_MAN_POWER: home.number_of_man_power,  
        NUMBER_OF_MACHINE_JIGS: home.number_of_machine_jigs,  
        FINAL_AVERAGE: octFinalAvg,               
        UPH: octUph,
      createdAt: home.createdAt
      
    });

    // Row for MCT
    const mctCycleTimes = [
      home.cycleTime1_MCT,
      home.cycleTime2,
      home.cycleTime3,
      home.cycleTime4,
      home.cycleTime5,
    ].filter(time => time !== undefined && !isNaN(time));
    const mctAvg = mctCycleTimes.length > 0 ? mctCycleTimes.reduce((a, b) => a + b, 0) / mctCycleTimes.length : 0;
    const mctFinalAvg = mctAvg / home.number_of_station / greaterValue;
    const mctUph = mctFinalAvg ? 3600 / mctFinalAvg : 0;

    csvData.push({
      STATION_NO: home.station_no,              
      STATION_NAME: home.station_name,          
      "OCT/MCT": "MCT",
      VALUE: home.cycleTime1_MCT,               
      CYCLETIME2: home.cycleTime2,              
      CYCLETIME3: home.cycleTime3,              
      CYCLETIME4: home.cycleTime4,              
      CYCLETIME5: home.cycleTime5,              
      AVERAGE_CT: mctAvg,                       
      NUMBER_OF_STATION: home.number_of_station, 
      NUMBER_OF_DEVICES: home.number_of_devices, 
      NUMBER_OF_MAN_POWER: home.number_of_man_power, 
      NUMBER_OF_MACHINE_JIGS: home.number_of_machine_jigs, 
      FINAL_AVERAGE: mctFinalAvg,               
      UPH: mctUph,
      createdAt: home.createdAt
      
    });
  });
  

    const fields = ['STATION_NO', 'STATION_NAME', 'OCT/MCT', 'VALUE', 'CYCLETIME2', 'CYCLETIME3', 'CYCLETIME4', 'CYCLETIME5', 'AVERAGE_CT', 'NUMBER_OF_STATION', 'NUMBER_OF_DEVICES', 'NUMBER_OF_MAN_POWER', 'NUMBER_OF_MACHINE_JIGS', 'FINAL_AVERAGE', 'UPH'];

    const json2csvParser = new Parser({ fields });
    // const csv = json2csvParser.parse(homes);
    const csv = json2csvParser.parse(csvData);

    res.header('Content-Type', 'text/csv');
    res.attachment('CycleTime_Data.csv');
    

    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// After app.use(cors())
// app.use(express.static(path.join(__dirname, '../cycle-time-login/dist')));

// Root route to serve frontend
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../cycle-time-login/dist', 'index.html'));
// });

// Catch-all for React Router
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../cycle-time-login/dist', 'index.html'));
// });

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// app.listen(3001, () => {
//   console.log("server is running");
// });

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});


