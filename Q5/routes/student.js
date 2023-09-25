const express = require('express');
const { verifyToken } = require('../middleware/token');
const student = express.Router();
const studentModel = require('../models/student');

student.use(verifyToken);

// Create
student.get('/add', (req, res) => {
    res.sendFile(__dirname + '/../views/add.html');
});

student.post('/', async (req, res) => {
    try {
        const newStudent = req.body;
        const student = new studentModel({
            ...newStudent
        });
        await student.save();
        res.redirect('/');
    } catch (error) {
        res.send('There was a problem creating students');
    }
});

// Read
student.get('/:id', async (req, res) => {
    try {
        const student = await studentModel.findById(req.params.id);
        if (student) {
            res.sendFile(__dirname + '/../public/view.html');
        } else {
            res.sendFile(__dirname + '/../public/index.html', { noDataError: 'No students found' });
        }
    } catch (error) {
        res.send('There was a problem getting student');
    }
});

student.get('/', async (req, res) => {
    try {
        const students = await studentModel.find();
        if (students.length > 0) {
            res.sendFile(__dirname + '/../public/index.html');
        } else {
            res.sendFile(__dirname + '/../public/index.html', { noDataError: 'No students found' });
        }
    } catch (error) {
        res.send('There was a problem getting students');
    }
});

// Update
student.get('/edit/:id', async (req, res) => {
    try {
        const student = await studentModel.findById(req.params.id);
        if (student) {
            res.sendFile(__dirname + '/../public/update.html');
        } else {
            res.sendFile(__dirname + '/../public/index.html', { noDataError: 'Student not found' });
        }
    } catch (error) {
        res.send('There was a problem getting student');
    }
});

student.post('/edit/:id', async (req, res) => {
    console.log('Student POST /:id');
    try {
        const updatedStudent = req.body;
        const id = req.params.id;
        console.log('Updated student: ', updatedStudent);
        delete updatedStudent['_id'];
        await studentModel.findOneAndUpdate({ _id: id }, updatedStudent);
        return res.redirect('/');
    } catch (error) {
        return res.send('There was a problem updating students');
    }
});

// Delete
student.get('/delete/:id', async (req, res) => {
    try {
        const student = await studentModel.findById(req.params.id);
        if (student) {
            res.sendFile(__dirname + '/../public/delete.html');
        } else {
            res.sendFile(__dirname + '/../public/index.html', { noDataError: 'Student not found' });
        }
    } catch (error) {
        res.send('There was a problem getting student');
    }
});

student.post('/delete', async (req, res) => {
    console.log('Delete student request');
    try {
        const id = req.body._id;
        console.log('ID: ', id);
        await studentModel.findOneAndDelete({ _id: id });
        res.redirect('/');
    } catch (error) {
        console.log('Error: ', error);
        res.send('There was a problem deleting students');
    }
});

module.exports = student;
