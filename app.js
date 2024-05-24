import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
app.use(express.static('public'));
// const db = new pg.Client({
//     connectionString: 'postgres://hjjzniqp:eYx43GLcFLNibenQB3GqhXZodJwLHx9l@rain.db.elephantsql.com/hjjzniqp',
// });
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "owner",
    password: "qwertyuiop",
    port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connected to the database');
    }

    db.on('error', (err) => {
        console.error('Database connection error:', err);
        if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
            console.log('Attempting to reconnect to the database...');
            db.connect()
                .then(() => {
                    console.log('Reconnected to the database successfully');
                })
                .catch(error => {
                    console.error('Failed to reconnect to the database:', error);
                });
        }
    });
});

app.get('/get', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.error('Error fetching users', err);
            res.status(500).json({ error: 'User not found!' });
        } else {
            res.json(result.rows);
        }
    });
});

app.get('/', (req, res) => {
    res.render('app.ejs');
});
app.get('/admin', (req, res) => {
    res.render('admin.ejs');
});
// app.post('/delete', (req, res) => {
//     const email = req.body['email'];
//     const password = req.body['password'];
//     try {
//         db.query("DELETE FROM users")
//             .then(result => {
//                 res.json({ message: "Users deleted successfully" });
//             })
//             .catch(error => {
//                 console.error("Error deleting user:", error);
//                 res.status(500).json({ error: "Internal server error" });
//             });
//     } catch (error) {
//         console.error("Error processing request:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// app.post('/manage', (req, res) => {
//     const email = req.body['email'];
//     const password = req.body['password'];
//     try {
//         db.query("DELETE FROM users WHERE email = $1 AND password = $2", [email, password])
//             .then(result => {
//                 res.json({ message: "User deleted successfully" });
//             })
//             .catch(error => {
//                 console.error("Error deleting user:", error);
//                 res.status(500).json({ error: "Internal server error" });
//             });
//     } catch (error) {
//         console.error("Error processing request:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });
app.post('/adminlogin', (req, res) => {
    const email = req.body['email'];
    const password = req.body['password'];
    const admin = "admin";
    db.query("SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3", [email, password, admin])
        .then(result => {
            if (result.rows.length > 0) {
                res.render("admindashboard.ejs", { users: result.rows });
            } else {
                res.send("you are not admin");
            }
        })
        .catch(err => {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});
app.get('/adminusers', (req, res) => {
    db.query("SELECT * FROM users")
        .then(result => {
            if (result.rows.length > 0) {
                res.render("admin_users.ejs", { users: result.rows });
            } else {
                res.json({ message: "No user found" });
            }
        })
        .catch(err => {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get('/login', (req, res) => {
    res.render("login.ejs");
});
app.post('/login', (req, res) => {
    res.render("dashboard.ejs");
});

// Handle form submission
app.post('/signup', async (req, res) => {
    const email = req.body['email'];
    const name = req.body['name'];
    const password = req.body['password'];
    const question = req.body['security_question'];
    const answer = req.body['security_answer'];
    const role = req.body['role'];

    // try {
    //     db.query("INSERT INTO users (email,name,password,security_question,security_answer) VALUES ($1, $2,$3,$4,$5)", [email, name, password, question, answer])
    //         .then(result => {
    //             res.render("success.ejs");
    //         })
    //         .catch(error => {
    //             console.error(error);
    //             res.status(500).send({
    //                 message: 'Error inserting data into database',
    //                 error: error.message
    //             });
    //         });
    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        if (checkResult.rows.length > 0) {
            res.send("Email already exists. Try logging in.");
        } else {
            db.query("INSERT INTO users (email,name,password,security_question,security_answer,role) VALUES ($1, $2,$3,$4,$5,$6)", [email, name, password, question, answer,role])
            res.render("success.ejs");
        }
    } catch (err) {
        console.log(err);
    }
});


app.get('/recover', (req, res) => {
    res.render("recover.ejs");
});
app.post('/recover', (req, res) => {
    const email = req.body['email'];
    const answer = req.body['s_answer'];
    db.query("SELECT name,email, password FROM users WHERE email = $1 AND security_answer = $2", [email, answer], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal server error" });
        } else {
            if (result.rows.length > 0) {
                res.render("users.ejs", { users: result.rows });
            } else {
                res.send("No user Found or Wrong Password Entered!");
            }
        }
    });
});
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

