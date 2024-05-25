// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";
// import passport from "passport";
// import { Strategy } from "passport-local";
// import session from "express-session";

// const app = express();
// const port = 3000;
//app.use(
//     session({
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         saveUninitialized: true,
//         cookie: { maxAge: 1000000 }
//     })
// );
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.use(passport.initialize());
// app.use(passport.session());

// const db = new pg.Client({
//     user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     password: process.env.PG_PASSWORD,
//     port: process.env.PG_PORT,
// });
// const db = new pg.Client({
//      connectionString: process.env.PG_STR,
// });
// db.connect();

// app.use(bodyParser.urlencoded({ extended: true }));

// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database', err);
//     } else {
//         console.log('Connected to the database');
//     }

//     db.on('error', (err) => {
//         console.error('Database connection error:', err);
//         if (err.code === 'ECONNRESET' || err.code === 'EPIPE') {
//             console.log('Attempting to reconnect to the database...');
//             db.connect()
//                 .then(() => {
//                     console.log('Reconnected to the database successfully');
//                 })
//                 .catch(error => {
//                     console.error('Failed to reconnect to the database:', error);
//                 });
//         }
//     });
// });

// app.get('/get', (req, res) => {
//     db.query('SELECT * FROM users', (err, result) => {
//         if (err) {
//             console.error('Error fetching users', err);
//             res.status(500).json({ error: 'User not found!' });
//         } else {
//             res.json(result.rows);
//         }
//     });
// });

// app.get('/', (req, res) => {
//     res.render('app.ejs');
// });
// app.get('/admin', (req, res) => {
//     res.render('admin.ejs');
// });
// // app.post('/delete', (req, res) => {
// //     const email = req.body['email'];
// //     const password = req.body['password'];
// //     try {
// //         db.query("DELETE FROM users")
// //             .then(result => {
// //                 res.json({ message: "Users deleted successfully" });
// //             })
// //             .catch(error => {
// //                 console.error("Error deleting user:", error);
// //                 res.status(500).json({ error: "Internal server error" });
// //             });
// //     } catch (error) {
// //         console.error("Error processing request:", error);
// //         res.status(500).json({ error: "Internal server error" });
// //     }
// // });

// // app.post('/manage', (req, res) => {
// //     const email = req.body['email'];
// //     const password = req.body['password'];
// //     try {
// //         db.query("DELETE FROM users WHERE email = $1 AND password = $2", [email, password])
// //             .then(result => {
// //                 res.json({ message: "User deleted successfully" });
// //             })
// //             .catch(error => {
// //                 console.error("Error deleting user:", error);
// //                 res.status(500).json({ error: "Internal server error" });
// //             });
// //     } catch (error) {
// //         console.error("Error processing request:", error);
// //         res.status(500).json({ error: "Internal server error" });
// //     }
// // });
// app.post('/adminlogin', (req, res) => {
//     const email = req.body['email'];
//     const password = req.body['password'];
//     const admin = "admin";
//     db.query("SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3", [email, password, admin])
//         .then(result => {
//             if (result.rows.length > 0) {
//                 res.render("admindashboard.ejs", { users: result.rows });
//             } else {
//                 res.send("you are not admin");
//             }
//         })
//         .catch(err => {
//             console.error("Error executing query:", err);
//             res.status(500).json({ error: "Internal server error" });
//         });
// });
// app.get('/adminusers', (req, res) => {
//     db.query("SELECT * FROM users")
//         .then(result => {
//             if (result.rows.length > 0) {
//                 res.render("admin_users.ejs", { users: result.rows });
//             } else {
//                 res.json({ message: "No user found" });
//             }
//         })
//         .catch(err => {
//             console.error("Error executing query:", err);
//             res.status(500).json({ error: "Internal server error" });
//         });
// });

// app.get('/login', (req, res) => {
//     res.render("login.ejs");
// });
// app.post("/login",passport.authenticate("local", {
//         successRedirect: "/dashboard",
//         failureRedirect: "/login",
//     })
// );

// app.get("/dashboard", (req, res) => {
//     if (req.isAuthenticated()) {
//         res.render("dashboard.ejs");
//     } else {
//         res.redirect("/login");
//     }
// });


// // Handle form submission
// // app.post('/signup', async (req, res) => {
// //     const email = req.body['email'];
// //     const name = req.body['name'];
// //     const password = req.body['password'];
// //     const question = req.body['security_question'];
// //     const answer = req.body['security_answer'];
// //     const role = req.body['role'];

// //     // try {
// //     //     db.query("INSERT INTO users (email,name,password,security_question,security_answer) VALUES ($1, $2,$3,$4,$5)", [email, name, password, question, answer])
// //     //         .then(result => {
// //     //             res.render("success.ejs");
// //     //         })
// //     //         .catch(error => {
// //     //             console.error(error);
// //     //             res.status(500).send({
// //     //                 message: 'Error inserting data into database',
// //     //                 error: error.message
// //     //             });
// //     //         });
// //     try {
// //         const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
// //             email,
// //         ]);
// //         if (checkResult.rows.length > 0) {
// //             res.send("Email already exists. Try logging in.");
// //         } else {
// //             db.query("INSERT INTO users (email,name,password,security_question,security_answer,role) VALUES ($1, $2,$3,$4,$5,$6)", [email, name, password, question, answer,role])
// //             res.render("success.ejs");
// //         }
// //     } catch (err) {
// //         console.log(err);
// //     }
// // });
// app.post("/signup", async (req, res) => {
//     const email = req.body['email'];
//         const name = req.body['name'];
//         const password = req.body['password'];
//         const question = req.body['security_question'];
//         const answer = req.body['security_answer'];
//         const role = req.body['role'];

//     try {
//         const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

//         if (checkResult.rows.length > 0) {
//             return res.redirect("/login");
//         } else {
//             const result = await db.query(
//                 "INSERT INTO users (email,name,password,security_question,security_answer) VALUES ($1, $2,$3,$4,$5)", [email, name, password, question, answer]
//             );
//             const user = result.rows[0];
//             req.login(user, (err) => {
//                 if (err) {
//                     return res.status(500).send('Login error');
//                 }
//                 res.redirect("/dashboard");
//             });
//         }
//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).send('Internal server error');
//     }
// });




// app.get('/recover', (req, res) => {
//     res.render("recover.ejs");
// });
// app.post('/recover', (req, res) => {
//     const email = req.body['email'];
//     const answer = req.body['s_answer'];
//     db.query("SELECT name,email, password FROM users WHERE email = $1 AND security_answer = $2", [email, answer], (err, result) => {
//         if (err) {
//             console.error("Error executing query:", err);
//             res.status(500).json({ error: "Internal server error" });
//         } else {
//             if (result.rows.length > 0) {
//                 res.render("users.ejs", { users: result.rows });
//             } else {
//                 res.send("No user Found or Wrong Password Entered!");
//             }
//         }
//     });
// });

// passport.use(
//     new Strategy(async function verify(email, password, cb) {
//         try {
//             const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
//             if (result.rows.length > 0) {
//                 const user = result.rows[0];
//                 const storedPassword = user.password;


//                 if (password === storedPassword) {
//                     return cb(null, user);
//                 } else {
//                     return cb(null, false, { message: 'Incorrect email or password.' });
//                 }
//             } else {
//                 return cb(null, false, { message: 'Incorrect email or password.' });
//             }
//         } catch (err) {
//             console.error("Error during authentication:", err);
//             return cb(err);
//         }
//     })
// );

// passport.serializeUser((user, cb) => {
//     cb(null, user);
// });
// passport.deserializeUser((user, cb) => {
//     cb(null, user);
// });

// app.listen(port, () => {
//     console.log(`Server is running on port http://localhost:${port}`);
// });

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import env from "dotenv";
env.config()

const app = express();
const port = 3000;

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1000000 }
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

// const db = new pg.Client({
//     user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     password: process.env.PG_PASSWORD,
//     port: process.env.PG_PORT,
// });
const db = new pg.Client({
    connectionString: process.env.PG_STR,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database", err);
    } else {
        console.log("Connected to the database");
    }

    db.on("error", (err) => {
        console.error("Database connection error:", err);
        if (err.code === "ECONNRESET" || err.code === "EPIPE") {
            console.log("Attempting to reconnect to the database...");
            db.connect()
                .then(() => {
                    console.log("Reconnected to the database successfully");
                })
                .catch((error) => {
                    console.error("Failed to reconnect to the database:", error);
                });
        }
    });
});

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("dashboard.ejs", { user: req.user });
    } else {
        res.redirect("/login");
    }
});

app.get("/admin", (req, res) => {
    res.render("admin.ejs");
});

app.post("/adminlogin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const admin = "admin";
    db.query(
        "SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3",
        [email, password, admin]
    )
        .then((result) => {
            if (result.rows.length > 0) {
                res.render("admindashboard.ejs", { users: result.rows });
            } else {
                res.send("You are not admin");
            }
        })
        .catch((err) => {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/adminusers", (req, res) => {
    db.query("SELECT * FROM users")
        .then((result) => {
            if (result.rows.length > 0) {
                res.render("admin_users.ejs", { users: result.rows });
            } else {
                res.json({ message: "No user found" });
            }
        })
        .catch((err) => {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    })
);

app.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("dashboard.ejs", { user: req.user });
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});
app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

app.get(
    "/auth/google/dashboard",
    passport.authenticate("google", {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
    })
);

app.get("/signup", (req, res) => {
    res.render("app.ejs");
})
app.post("/signup", async (req, res) => {
    const { email, name, password, security_question, security_answer, role } = req.body;

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

        if (checkResult.rows.length > 0) {
            return res.redirect("/emailexist");
        } else {
            await db.query(
                "INSERT INTO users (email, name, password, security_question, security_answer, role) VALUES ($1, $2, $3, $4, $5, $6)",
                [email, name, password, security_question, security_answer, role]
            );
            req.login({ email, name, role }, (err) => {
                if (err) {
                    return res.status(500).send("Login error");
                }
                res.redirect("/signupsuccess");
            });
        }
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal server error");
    }
});
app.get("/emailexist", (req, res) => {
    res.render("emailexist.ejs");
})
app.get("/signupsuccess", (req, res) => {
    res.render("success.ejs")
})

app.get("/recover", (req, res) => {
    res.render("recover.ejs");
});


app.post("/recover", (req, res) => {
    const { email, s_answer } = req.body;
    db.query(
        "SELECT name, email, password FROM users WHERE email = $1 AND security_answer = $2",
        [email, s_answer],
        (err, result) => {
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
        }
    );
});

passport.use(
    new Strategy({ usernameField: 'email' }, async function verify(email, password, cb) {
        try {
            const result = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);

            if (result.rows.length > 0) {
                const user = result.rows[0];
                return cb(null, user);
            } else {
                return cb(null, false, { message: "Incorrect email or password." });
            }
        } catch (err) {
            console.error("Error during authentication:", err);
            return cb(err);
        }
    })
);

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://sampleserver-fkld.onrender.com/auth/google/dashboard",
            userProfileURL: process.env.GOOGLE_userProfileURL,
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const result = await db.query("SELECT * FROM users WHERE email = $1", [
                    profile.email,
                ]);
                const name = profile.displayName;
                if (result.rows.length === 0) {
                    const newUser = await db.query(
                        "INSERT INTO users (name,email, password,security_question,security_answer) VALUES ($1, $2,$3,$4,$5)",
                        [name, profile.email, "google", "google", "google"]
                    );
                    return cb(null, newUser.rows[0]);
                } else {
                    return cb(null, result.rows[0]);
                }
            } catch (err) {
                return cb(err);
            }
        }
    )
);
passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
