import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    employee_id: "",
    // project: "",
    // model: "",
    cycleTime1: "",
    station_no: "",
    station_name:"",
    cycleTime1_OCT: "",
    cycleTime1_MCT: "",
    cycleTime2: "",
    cycleTime3: "",
    cycleTime4: "",
    cycleTime5: "",
    number_of_station: "",
    number_of_devices: "",
    number_of_man_power: "",
    number_of_machine_jigs: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", formData); // Debugging log
    try {
      const response = await axios.post('http://localhost:3001/home', formData);
      console.log("Response from server", response); // Debugging log
      alert('Form submitted successfully');
      navigate('/login');   // Redirect to login or any other page after submission
    } catch (err) {
      console.error("Error submitting form", err); // Debugging log
    }
  };
 

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Employee Cycle Time Form</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
        {[
          { name: "name", placeholder: "Name" },
          { name: "employee_id", placeholder: "Employee ID" },
          {name : "station_no", placeholder: "Station number", type: "number"},
          {name : "station_name", placeholder: "Station name"},
          { name: "CycleTime1", placeholder: "", type: "heading" },
          { name: "cycleTime2", placeholder: "Cycle Time 2", type: "number" },
          { name: "cycleTime3", placeholder: "Cycle Time 3", type: "number" },
          { name: "cycleTime4", placeholder: "Cycle Time 4", type: "number" },
          { name: "cycleTime5", placeholder: "Cycle Time 5", type: "number" },
          { name: "number_of_station", placeholder: "Number of Stations", type: "number" },
          { name: "number_of_devices", placeholder: "Number of Devices", type: "number" },
          { name: "number_of_man_power", placeholder: "Number of Man Power", type: "number" },
          { name: "number_of_machine_jigs", placeholder: "Number of Machine/Jigs", type: "number" },
        ].map((field, index) => {
          if (field.name === "CycleTime1") {
            return (
              <div key={index}>
                <h5>{field.name}</h5>
                <input
                  type="number"
                  name="cycleTime1_OCT"
                  placeholder="cycleTime1_OCT"
                  value={formData.cycleTime1_OCT}
                  onChange={handleChange}
                  required
                  style={{ margin: "10px 0", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
                <input
                  type="number"
                  name="cycleTime1_MCT"
                  placeholder="cycleTime1_MCT"
                  value={formData.cycleTime1_MCT}
                  onChange={handleChange}
                  required
                  style={{ margin: "10px 0",marginLeft: "47px" , padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                />
              </div>
            );
          } else {
            return (
              <input
                key={index}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required
                style={{ margin: "10px 0", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
              />
            );
          }
        })

        }
        <button type="submit" style={{ marginTop: "10px", padding: "10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>Submit</button>
      </form>
    </div>
  );
};

export default Home;
