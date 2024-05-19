import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';



//const express = require('express');
//co0nst bodyParser = require('body-parser');
import cors from 'cors';
import bcrypt from 'bcrypt';
const app = express();
//const { Pool, Connection } = require('pg');
dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));




const PORT = process.env.PORT || 5000;
const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
})
db.connect()
    .then(() => console.log('postgreSQL connected'))
    .catch(err => console.error('Error',err.stack));


/*const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
let islogin = false;
const db = new pg.Client({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: 5432,
  ssl:{
    require:true

});
db.connect(); */

/* const Client = new pg.Client({
  ConnectionString: postgresql://NSS_owner:OZ1FfA7XRnkr@ep-bold-haze-a14k7ohz.ap-southeast-1.aws.neon.tech/NSS?sslmode=require
}); */



app.post('/signup', async (req, res) => {
  try {
    const { name, rollno, gender , dob, phoneno, email,  password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO volunteers (name , volunteer_id, gender , date_of_birth,  email, password ) VALUES ($1, $2, $3, $4, $5, $6)', [name, rollno, gender , dob,  email, hashedPassword]);
    await db.query('INSERT INTO contact (contact_id,phone_no)  values ($1,$2) ',[rollno,phoneno]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/forgetPassword', async (req, res) => {
  try {
    const {  rollno,   email,  password } = req.body;
    const result = await db.query('SELECT * FROM volunteers WHERE volunteer_id = $1 and email = $2', [rollno,email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'user not exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('UPDATE volunteers set password=$3 where volunteer_id=$1 and email=$2 ', [rollno, email, hashedPassword,]);
    console.log('changed succesfully');
    res.status(201).json({ message: 'User Password updated successfully' });
  } catch (error) {
    console.error('Error changing password up:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { rollno, password } = req.body;
    const result = await db.query('SELECT * FROM volunteers WHERE volunteer_id = $1', [rollno]);
    
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'user not exists' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' }),
      console.log('Incorrect Rollno or Password');
    }
    res.json({ message: 'Login successful' });
    console.log('Login Sucess');
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/name', async (req, res) => {
  // Extract user_id from query parameters
  const { rollno } = req.query;

  // Check if user_id is provided
  if (!rollno) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT name FROM volunteers WHERE volunteer_id = $1';
    const result = await db.query(query, [rollno]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract the user's name from the database result
    const userName = result.rows[0].name;

    // Send the user's name in the response
    res.json({ name: userName });
  } catch (error) {
    console.error('Error fetching user name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/Email', async (req, res) => {
  // Extract user_id from query parameters
  const { rollno } = req.query;

  // Check if user_id is provided
  if (!rollno) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT email FROM volunteers WHERE volunteer_id = $1';
    const result = await db.query(query, [rollno]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User Email not found' });
    }

    // Extract the user's name from the database result
    const userEmail = result.rows[0].email;
    

    // Send the user's name in the response
    res.json({ Email: userEmail });
  } catch (error) {
    console.error('Error fetching user Email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/DOB', async (req, res) => {
  // Extract user_id from query parameters
  const { rollno } = req.query;

  // Check if user_id is provided
  if (!rollno) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT date_of_birth FROM volunteers WHERE volunteer_id = $1';
    const result = await db.query(query, [rollno]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User 	date_of_birth not found' });
    }

    // Extract the user's name from the database result
    const userDOB = result.rows[0].	date_of_birth;

    // Send the user's name in the response
    res.json({ DOB: userDOB });
  } catch (error) {
    console.error('Error fetching user 	date_of_birth:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/manuals', async (req, res) => {
  // Extract unit from query parameters
  const { unit } = req.query;

  // Check if unit is provided
  if (!unit) {
    return res.status(400).json({ error: 'Unit is required' });
  }

  try {
    // Query the database to fetch manuals based on unit
    const query = 'SELECT * FROM manuals WHERE unit_no = $1';
    const result = await db.query(query, [unit]);

    // Check if manuals with the provided unit exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No manuals found for the provided unit' });
    }

    // Send the manuals in the response
    res.json({ manuals: result.rows });
  } catch (error) {
    console.error('Error fetching manuals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/manualsAttended', async (req, res) => {
  // Extract user_id from query parameters
  const { rollno } = req.query;

  // Check if user_id is provided
  if (!rollno) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT COUNT(volunteer_id) AS volunteer_count FROM participations WHERE volunteer_id = $1';
    const result = await db.query(query, [rollno]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User 	manualsAttended not found' });
    }

    // Extract the user's name from the database result
    const userManualCount = result.rows[0].volunteer_count;
  

    // Send the user's name in the response
    res.json({ manualCount: userManualCount });
  } catch (error) {
    console.error('Error fetching user manuals Count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/role', async (req, res) => {
  // Extract user_id from query parameters
  const { rollno } = req.query;

  // Check if user_id is provided
  if (!rollno) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT title from roles where role_id = ( select role_id from volunteer_roles where volunteer_id = $1)';
    const result = await db.query(query, [rollno]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User 	role not found' });
    }

    // Extract the user's name from the database result
    const userRole = result.rows[0].title;

    // Send the user's name in the response
    res.json({ role: userRole });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/joinDate', async (req, res) => {
  // Extract user_id from query parameters
  const { rollno } = req.query;

  // Check if user_id is provided
  if (!rollno) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT 	joining_date FROM volunteers WHERE volunteer_id = $1';
    const result = await db.query(query, [rollno]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User 	joining_date not found' });
    }

    // Extract the user's name from the database result
    const userJoinDate = result.rows[0].joining_date;

    // Send the user's name in the response
    res.json({ joinDate: userJoinDate });
  } catch (error) {
    console.error('Error fetching user joining_date:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/unit', async (req, res) => {
  // Extract user_id from query parameters
  const { rollno } = req.query;

  // Check if user_id is provided
  if (!rollno) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT unit_no FROM volunteers WHERE volunteer_id = $1';
    const result = await db.query(query, [rollno]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    // Extract the user's name from the database result
    const userUnit = result.rows[0].unit_no;

    // Send the user's name in the response
    res.json({ unit: userUnit });
    
  } catch (error) {
    console.error('Error fetching user unit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/programOfficer', async (req, res) => {
  // Extract user_id from query parameters
  const { unit } = req.query;

  // Check if user_id is provided
  if (!unit) {
    return res.status(400).json({ error: 'User Unit is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT name FROM program_officers WHERE pro_id = (SELECT pro_id from unit where unit_no= $1)';
    const result = await db.query(query, [unit]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'program officer not found' });
    }

    // Extract the user's name from the database result
    const userProgramOfficer = result.rows[0].name;

    // Send the user's name in the response
    res.json({ programOfficer: userProgramOfficer });
   
    
  } catch (error) {
    console.error('Error fetching user Program Officer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/unitVolunteers', async (req, res) => {
  // Extract user_id from query parameters
  const { unit } = req.query;

  // Check if user_id is provided
  if (!unit) {
    return res.status(400).json({ error: 'User Unit is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT no_of_volunteers FROM unit where unit_no= $1';
    const result = await db.query(query, [unit]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'unit not found' });
    }

    // Extract the user's name from the database result
    const userUnitVolunteers = result.rows[0].no_of_volunteers;

    // Send the user's name in the response
    res.json({ unitVolunteers: userUnitVolunteers });
    
   
    
  } catch (error) {
    console.error('Error fetching user Unit volunteers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/user/unitGS', async (req, res) => {
  // Extract user_id from query parameters
  const { unit } = req.query;

  // Check if user_id is provided
  if (!unit) {
    return res.status(400).json({ error: 'User Unit is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT general_secretory FROM unit where unit_no= $1';
    const result = await db.query(query, [unit]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'unit not found' });
    }

    // Extract the user's name from the database result
    const userUnitGS = result.rows[0].general_secretory;

    // Send the user's name in the response
    res.json({ unitGS: userUnitGS });
    
   
    
  } catch (error) {
    console.error('Error fetching user Unit GS:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/unitJS', async (req, res) => {
  // Extract user_id from query parameters
  const { unit } = req.query;

  // Check if user_id is provided
  if (!unit) {
    return res.status(400).json({ error: 'User Unit is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT junior_secretory FROM unit where unit_no= $1';
    const result = await db.query(query, [unit]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'unit not found' });
    }

    // Extract the user's name from the database result
    const userUnitJS = result.rows[0].junior_secretory;

    // Send the user's name in the response
    res.json({ unitJS: userUnitJS });
     
   
    
  } catch (error) {
    console.error('Error fetching user Unit JS:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/user/unitManualsConducted', async (req, res) => {
  // Extract user_id from query parameters
  const { unit } = req.query;

  // Check if user_id is provided
  if (!unit) {
    return res.status(400).json({ error: 'User Unit is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT manuals_conducted FROM unit where unit_no= $1';
    const result = await db.query(query, [unit]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'unit not found' });
    }

    // Extract the user's name from the database result
    const userUnitManualsConducted = result.rows[0].manuals_conducted;

    // Send the user's name in the response
    res.json({ unitManualsConducted: userUnitManualsConducted });
     
   
    
  } catch (error) {
    console.error('Error fetching user Unit Manuals Conducted:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/Adlogin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query('SELECT * FROM program_officers WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Admin not exists' });
    }
    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' }),
      console.log('Incorrect Rollno or Password');
    }
    res.json({ message: 'Admin Login successful' });
    console.log('Admin Login Sucess');
  } catch (error) {
    console.error('Error admin logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const response=db.query("SELECT * FROM unit");
console.log(response);