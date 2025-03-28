// const mongoose = require('mongoose');

// const EmployeeSchema = new mongoose.Schema(
//   {
//     name:String,
//     email:String,
//     password:String
//   }
// )

// const EmployeeModel = mongoose.model('employee', EmployeeSchema)
// module.exports = EmployeeModel

const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    // name: { type: String }, // Optional: Name rakhna chahein toh
    email: { type: String, required: true, unique: true }, // Email unique aur required
    userId: { type: String, required: true, unique: true }, // userId for login
    password: { type: String, required: true }, // Password required
    isAdmin: { type: Boolean, default: false } // Admin check, default false
  },
  {
    timestamps: false // No automatic createdAt/updatedAt
  }
);

const EmployeeModel = mongoose.model('employees', EmployeeSchema); // Collection name: 'employees'
module.exports = EmployeeModel;