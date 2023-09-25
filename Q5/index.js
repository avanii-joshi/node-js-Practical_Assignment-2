const express = require('express');
const app = express();
const PORT = 8000;
const database = require('./db/database');
const student = require('./routes/student');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const accessTokenSecret = process.env.TOKEN_SECRET;
const studentModel = require('./models/student');
const verifyToken = require('./middleware/token');

app.use(cookieParser());
app.set('view engine', 'html'); // Set view engine to "html"
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views')); // Serve static files

app.use('/student', student);

app.get('/', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        // Verify token
        if (jwt.verify(token, process.env.TOKEN_SECRET)) {
            return res.redirect('/student');
        } else {
            return res.status(401).end('Unauthorized access');
        }
    } else {
        // Redirect to login
        return res.sendFile(__dirname + '/views/login.html'); // Use sendFile to serve HTML
    }
});

app.post('/login', async (req, res) => {
    let { username, password } = req.body;
    if (username && password) {
        try {
            let result = await studentModel.find({ name: username, password: password });
            if (result.length === 1) {
                // Generate Token
                const accessToken = jwt.sign({ name: username, password: password }, accessTokenSecret);
                res.cookie('token', accessToken, { httpOnly: true });
                return res.redirect('/student');
            } else {
                res.sendFile(__dirname + '/public/login.html', { errors: { validationError: 'Enter Valid Username Or Password' } });
            }
        } catch (error) {
            res.sendFile(__dirname + '/public/login.html', { errors: { validationError: 'There Was Problem While Log In.' } });
        }
    } else {
        res.sendFile(__dirname + '/public/login.html', { errors: { AllFieldsError: 'Please Enter Username And Password' } });
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.sendFile(__dirname + '/public/login.html'); // Redirect to login.html
});

app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}`);
});
