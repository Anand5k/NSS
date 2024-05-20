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
    const { rollno, email, password } = req.body;
    
    // Check if the user exists
    const result = await db.query('SELECT * FROM volunteers WHERE volunteer_id = $1 AND email = $2', [rollno, email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not exists' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the user's password
    await db.query('UPDATE volunteers SET password = $3 WHERE volunteer_id = $1 AND email = $2', [rollno, email, hashedPassword]);
    
    console.log('Password changed successfully');
    res.status(201).json({ message: 'User Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/user/addPhoneno', async (req, res) => {
  try {
    const { rollno, phoneno } = req.body;
    
    // Check if the user exists
    const result = await db.query('SELECT * FROM volunteers WHERE volunteer_id = $1', [rollno]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not exists' });
    }

    // Hash the new password
    
    
    // Update the user's password
    await db.query('INSERT INTO contact (contact_id,phone_no)  values ($1,$2) ',[rollno,phoneno]);
    //console.log('PhoneNo. Added successfully');
    res.status(201).json({ message: 'User phoneNo. Added successfully' });
  } catch (error) {
    console.error('Error Adding PhoneNo.:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/user/updatePhoneno', async (req, res) => {
  try {
    const { rollno, phoneno, newPhoneno } = req.body;
    
    // Check if the user exists
    const result = await db.query('SELECT * FROM contact WHERE contact_id = $1 and phone_no = $2', [rollno, phoneno]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User phone Number not exists' });
    }
    await db.query('Update contact set phone_no = $3 WHERE contact_id = $1 and phone_no = $2 ',[rollno,phoneno,newPhoneno]);
    //console.log('PhoneNo. Added successfully');
    res.status(201).json({ message: 'User phoneNo. Updated successfully' });
  } catch (error) {
    console.error('Error Updating PhoneNo.:', error);
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
    const query = 'SELECT * FROM manuals WHERE unit_no = $1 ORDER BY manual_id ASC';
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

app.get('/Ad/unitDetails', async (req, res) => {
  // Extract user_id from query parameters
  const { unit } = req.query;

  // Check if user_id is provided
  if (!unit) {
    return res.status(400).json({ error: 'User Unit is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT * FROM unit where unit_no= $1';
    const result = await db.query(query, [unit]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'unit not found' });
    }

    // Extract the user's name from the database result
    const AdUnitManualsConducted = result.rows[0].manuals_conducted;
    const AdUnitGS = result.rows[0].general_secretory;
    const AdUnitJS = result.rows[0].junior_secretory;
    const AdUnitVolunteers = result.rows[0].no_of_volunteers;

    // Send the user's name in the response
    res.json({ unitManualsConducted: AdUnitManualsConducted,
              unitGS: AdUnitGS,
              unitJS: AdUnitJS,
              unitVolunteers: AdUnitVolunteers
     });
     
   
    
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
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.json({ message: 'Admin Login successful' });
  } catch (error) {
    console.error('Error admin logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/Ad/attendence', async (req, res) => {
  const { unit } = req.query;

  if (!unit) {
    return res.status(400).json({ error: 'Unit is required' });
  }

  try {
    // Define the attendance query
    const attendanceQuery = `
      WITH manual_participation AS (
          SELECT
              m.manual_id,
              m.theme,
              COUNT(p.volunteer_id) AS no_of_present
          FROM
              manuals m
          LEFT JOIN
              participations p ON m.manual_id = p.manual_id
          WHERE
              m.unit_no = $1
          GROUP BY
              m.manual_id, m.theme
      ),
      volunteer_counts AS (
          SELECT
              COUNT(volunteer_id) AS total_volunteers
          FROM
              volunteers
          WHERE
              unit_no = $1
      ),
      absentees AS (
          SELECT
              m.manual_id,
              STRING_AGG(v.volunteer_id::TEXT, ', ') AS absentees_volunteer_id
          FROM
              manuals m
          CROSS JOIN
              volunteers v
          LEFT JOIN
              participations p ON m.manual_id = p.manual_id AND v.volunteer_id = p.volunteer_id
          WHERE
              v.unit_no = $1 AND p.volunteer_id IS NULL
              AND m.unit_no = $1
          GROUP BY
              m.manual_id
      )
      SELECT
          mp.manual_id,
          mp.theme,
          mp.no_of_present,
          vc.total_volunteers - mp.no_of_present AS no_of_absent,
          COALESCE(a.absentees_volunteer_id, '') AS absentees_volunteer_id
      FROM
          manual_participation mp
      CROSS JOIN
          volunteer_counts vc
      LEFT JOIN
          absentees a ON mp.manual_id = a.manual_id
          ORDER BY
          mp.manual_id ASC;
    `;

    // Execute the query with the given unit_no
    const result = await db.query(attendanceQuery, [unit]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attendance not found' });
    }

    res.json({ attendence: result.rows });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/Ad/manualInsert', async (req, res) => {
  try {
    const { AdUnit, theme, description, manualDate, duration, Location, LO, absentees  } = req.body;
    await db.query('INSERT INTO manuals (  unit_no, theme, description, date, duration, location, lead_organiser ) VALUES ($1, $2, $3, $4, $5, $6, $7)', [AdUnit,  theme, description, manualDate, duration, Location, LO]);
    
    const attendanceQuery = `
    WITH max_manual AS (
      SELECT MAX(manual_id) AS manual_id
      FROM manuals
    ),
    filtered_volunteers AS (
      SELECT volunteer_id
      FROM volunteers
      WHERE unit_no = $1
      AND volunteer_id::text != ALL (string_to_array($2, ','))
    )
    INSERT INTO participations (volunteer_id, manual_id)
    SELECT fv.volunteer_id, mm.manual_id
    FROM filtered_volunteers fv, max_manual mm;
    
    `;

    await db.query(attendanceQuery, [AdUnit,absentees]);
    res.status(201).json({ message: 'Manual inserted successfully' });
  } catch (error) {
    console.error('Error While Insert Manual:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/Ad/volunteerDetails', async (req, res) => {
  // Extract unit from query parameters
  const { unit } = req.query;

  // Check if unit is provided
  if (!unit) {
    return res.status(400).json({ error: 'Unit is required' });
  }

  try {
    // Query the database to fetch manuals based on unit
    const query = `
    SELECT 
    v.volunteer_id,
    v.name,
    v.email,
    r.title AS role,
    COUNT(p.volunteer_id) AS no_of_manuals_attended
FROM 
    volunteers v
LEFT JOIN 
    volunteer_roles vr ON v.volunteer_id = vr.volunteer_id
LEFT JOIN 
    roles r ON vr.role_id = r.role_id
LEFT JOIN 
    participations p ON v.volunteer_id = p.volunteer_id
WHERE 
    v.unit_no = $1
GROUP BY 
    v.volunteer_id, v.name, v.email, r.title
ORDER BY 
    v.volunteer_id ASC;

    `;
    const result = await db.query(query, [unit]);

    // Check if manuals with the provided unit exist
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No volunteers Details  found for the provided unit by admin' });
    }

    // Send the manuals in the response
    res.json({ details: result.rows });
  } catch (error) {
    console.error('Error fetching volunteers Details by Admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/Ad/ID_name', async (req, res) => {
  // Extract user_id from query parameters
  const { email } = req.query;

  // Check if user_id is provided
  if (!email) {
    return res.status(400).json({ error: 'Admin Email is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT pro_id, name from program_officers where email= $1';
    const result = await db.query(query, [email]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin pro_id,name not found' });
    }

    // Extract the user's name from the database result
    const AdID = result.rows[0].pro_id;
    const AdName = result.rows[0].name; 

    // Send the user's name in the response
    res.json({ proid: AdID,
               AdName: AdName
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

app.get('/Ad/unit', async (req, res) => {
  // Extract user_id from query parameters
  const { pro_id } = req.query;

  // Check if user_id is provided
  if (!pro_id) {
    return res.status(400).json({ error: 'Admin pro_id is required' });
  }

  try {
    // Query the database to fetch the user's name based on user_id
    const query = 'SELECT unit_no FROM unit where pro_id= $1';
    const result = await db.query(query, [pro_id]);

    // Check if user with the provided user_id exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'unit not found for given pro_id' });
    }

    // Extract the user's name from the database result
    const Adunit = result.rows[0].unit_no;

    // Send the user's name in the response
    res.json({ AdUnit: Adunit });
     
   
    
  } catch (error) {
    console.error('Error fetching Admin Unit_no:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

    
  } catch (error) {
    console.error('Error fetching Admin pro_id and name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const response=db.query("SELECT * FROM unit");
console.log(response);