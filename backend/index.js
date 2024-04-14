const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg')
require("dotenv").config();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const mysql2 = require('mysql2');


const app = express();
const port = process.env.PORT || 6000;
app.use(express.json());


const corsOptions = {
    origin: [ "http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  };

app.use(cors(null , corsOptions))


const pool = mysql2.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "1234567890",
    database: "qrc",
    port: 3306
});




app.get('/', (req, res) => {
    res.send("QR Code Api");
  });

// Sign up a new user
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
        pool.query(emailCheckQuery, [email], (emailCheckError, emailCheckResult) => {
            if (emailCheckError) {
                console.error(emailCheckError);
                return res.status(500).send('Error checking email');
            }

            if (emailCheckResult && emailCheckResult.length > 0) {
                return res.status(409).send('Email already exists');
            }

            bcrypt.hash(password, 10, (hashError, hashed_password) => {
                if (hashError) {
                    console.error(hashError);
                    return res.status(500).send('Error hashing password');
                }

                const insertQuery = 'INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)';
                pool.query(insertQuery, [name, email, hashed_password], (insertError, result) => {
                    if (insertError) {
                        console.error(insertError);
                        return res.status(500).send('Error creating user');
                    }

                    res.json({ id: result.insertId, name });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});


// Login with existing user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = 'SELECT * FROM users WHERE email = ?';
        pool.query(query, [email], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error during login');
            }

            if (results.length === 0) {
                return res.status(401).send('User not found');
            }

            const user = results[0];
            const passwordMatch = await bcrypt.compare(password, user.hashed_password);

            if (passwordMatch) {
                const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET);

                res.json({ message: 'Login successful', token });
            } else {
                res.status(401).send('Incorrect password');
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
});



// Create a QR code
app.post('/qrcodes', async (req, res) => {
    try {
        const { user_id, data } = req.body;

        const insertQRCodeQuery = 'INSERT INTO qr_data (user_id, data) VALUES (?, ?)';
        const values = [user_id, data];
        console.log('SQL Query:', insertQRCodeQuery);
        console.log('Data Values:', values);

        pool.query(insertQRCodeQuery, values, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error creating QR code');
            }

            res.json({ id: result.insertId });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating QR code');
    }
});


// Fetch all QR codes related to a user
app.get('/qrcodes/:user_id', async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const offset = (page - 1) * perPage;

        // Modify the SQL query to use LIMIT and OFFSET for pagination
        const query = 'SELECT * FROM qr_data WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?';
        pool.query(query, [user_id, perPage, offset], async (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error fetching QR codes');
            }

            // Calculate total pages by counting all QR codes for the user
            const countQuery = 'SELECT COUNT(*) AS count FROM qr_data WHERE user_id = ?';
            pool.query(countQuery, [user_id], (countError, countResult) => {
                if (countError) {
                    console.error(countError);
                    return res.status(500).send('Error fetching QR codes');
                }

                const totalCount = countResult[0].count;
                const totalPages = Math.ceil(totalCount / perPage);

                res.json({ qrCodes: result, totalPages });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching QR codes');
    }
});
  

// Delete a QR code entry
app.delete('/qrcodes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleteQuery = 'DELETE FROM qr_data WHERE id = ?';
        pool.query(deleteQuery, [id], (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error deleting QR code');
            }

            if (result.affectedRows === 0) {
                return res.status(404).send('QR code not found');
            }

            res.send('QR code deleted successfully');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting QR code');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port s${port}`);
});