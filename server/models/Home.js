const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
  name: String,
  employee_id: String,
  station_no: Number,
  station_name :  String,
  cycleTime1_OCT: Number,
  cycleTime1_MCT: Number,
  cycleTime2: Number,
  cycleTime3: Number,
  cycleTime4: Number,
  cycleTime5: Number,
  average_CT:  Number,
  number_of_station: Number,
  number_of_devices: Number,
  number_of_man_power: Number,
  number_of_machine_jigs: Number,
  final_average:  Number,
  uph: Number,
  // createdAt : {
  //   type: Date,
  //   default: Date.now
  // }

  createdAt: { type: String } // Explicitly String type
}, { timestamps: false }
);

const HomeModel = mongoose.model('home', HomeSchema);
module.exports = HomeModel;