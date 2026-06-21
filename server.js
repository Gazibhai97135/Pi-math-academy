// Pi Math Academy - Backend Server
// Developed by Arko

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// In-memory data storage (in a real app, this would be a database)
let students = [
    { id: 1, name: "Ahmed Rahman", email: "ahmed@example.com", phone: "01712345678", class: "6", paymentStatus: "paid", lastPayment: "2026-06-01" },
    { id: 2, name: "Fatima Islam", email: "fatima@example.com", phone: "01812345678", class: "6", paymentStatus: "pending", lastPayment: null },
    { id: 3, name: "Sakib Khan", email: "sakib@example.com", phone: "01912345678", class: "7", paymentStatus: "paid", lastPayment: "2026-06-05" },
    { id: 4, name: "Tasnim Akter", email: "tasnim@example.com", phone: "01612345678", class: "7", paymentStatus: "pending", lastPayment: null },
    { id: 5, name: "Rahim Uddin", email: "rahim@example.com", phone: "01512345678", class: "8", paymentStatus: "paid", lastPayment: "2026-06-10" },
    { id: 6, name: "Nusrat Jahan", email: "nusrat@example.com", phone: "01312345678", class: "8", paymentStatus: "pending", lastPayment: null },
    { id: 7, name: "Karim Hossain", email: "karim@example.com", phone: "01412345678", class: "9", paymentStatus: "paid", lastPayment: "2026-06-15" },
    { id: 8, name: "Sabina Yasmin", email: "sabina@example.com", phone: "01723456789", class: "9", paymentStatus: "pending", lastPayment: null },
    { id: 9, name: "Mamun Ahmed", email: "mamun@example.com", phone: "01823456789", class: "10", paymentStatus: "paid", lastPayment: "2026-06-18" },
    { id: 10, name: "Rina Begum", email: "rina@example.com", phone: "01923456789", class: "10", paymentStatus: "pending", lastPayment: null }
];

let homework = [
    { id: 1, class: "6", description: "Complete Exercise 2.3 (Q1-Q5)", assignedDate: "2026-06-20", dueDate: "2026-06-27" },
    { id: 2, class: "7", description: "Solve problems from Chapter 5", assignedDate: "2026-06-18", dueDate: "2026-06-25" },
    { id: 3, class: "8", description: "Review Algebra basics for test", assignedDate: "2026-06-15", dueDate: "2026-06-22" }
];

let fees = {
    "6": 800,
    "7": 900,
    "8": 1000,
    "9": 1100,
    "10": 1200
};

let notifications = [
    { id: 1, message: "Class test scheduled for next Monday", date: "2026-06-20", class: "all" },
    { id: 2, message: "Please submit your homework on time", date: "2026-06-18", class: "8" }
];

// Teacher info
const teacher = {
    id: 1,
    name: "Jubair Tushar",
    role: "teacher"
};

// API Routes

// Get teacher info
app.get('/api/teacher', (req, res) => {
    res.json(teacher);
});

// Get all students
app.get('/api/students', (req, res) => {
    res.json(students);
});

// Get students by class
app.get('/api/students/class/:classId', (req, res) => {
    const classId = req.params.classId;
    const classStudents = students.filter(student => student.class === classId);
    res.json(classStudents);
});

// Add a new student
app.post('/api/students', (req, res) => {
    const newStudent = {
        id: students.length + 1,
        ...req.body
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// Update student
app.put('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const studentIndex = students.findIndex(s => s.id === id);
    
    if (studentIndex === -1) {
        return res.status(404).json({ message: 'Student not found' });
    }
    
    students[studentIndex] = {
        ...students[studentIndex],
        ...req.body
    };
    
    res.json(students[studentIndex]);
});

// Get all homework
app.get('/api/homework', (req, res) => {
    res.json(homework);
});

// Get homework by class
app.get('/api/homework/class/:classId', (req, res) => {
    const classId = req.params.classId;
    const classHomework = homework.filter(hw => hw.class === classId);
    res.json(classHomework);
});

// Assign new homework
app.post('/api/homework', (req, res) => {
    const newHw = {
        id: homework.length + 1,
        ...req.body,
        assignedDate: new Date().toISOString().split('T')[0]
    };
    homework.push(newHw);
    res.status(201).json(newHw);
});

// Update homework
app.put('/api/homework/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const hwIndex = homework.findIndex(h => h.id === id);
    
    if (hwIndex === -1) {
        return res.status(404).json({ message: 'Homework not found' });
    }
    
    homework[hwIndex] = {
        ...homework[hwIndex],
        ...req.body
    };
    
    res.json(homework[hwIndex]);
});

// Delete homework
app.delete('/api/homework/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const hwIndex = homework.findIndex(h => h.id === id);
    
    if (hwIndex === -1) {
        return res.status(404).json({ message: 'Homework not found' });
    }
    
    homework.splice(hwIndex, 1);
    res.json({ message: 'Homework deleted successfully' });
});

// Get fees
app.get('/api/fees', (req, res) => {
    res.json(fees);
});

// Update fees
app.put('/api/fees', (req, res) => {
    fees = { ...fees, ...req.body };
    res.json({ message: 'Fees updated successfully', fees });
});

// Get all notifications
app.get('/api/notifications', (req, res) => {
    res.json(notifications);
});

// Send notification
app.post('/api/notifications', (req, res) => {
    const newNotification = {
        id: notifications.length + 1,
        ...req.body,
        date: new Date().toISOString().split('T')[0]
    };
    notifications.push(newNotification);
    res.status(201).json(newNotification);
});

// Mark payment status
app.put('/api/students/:id/payment', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const student = students.find(s => s.id === id);
    
    if (!student) {
        return res.status(404).json({ message: 'Student not found' });
    }
    
    student.paymentStatus = status;
    if (status === 'paid') {
        student.lastPayment = new Date().toISOString().split('T')[0];
    } else {
        student.lastPayment = null;
    }
    
    res.json({ message: 'Payment status updated', student });
});

// Get dashboard stats
app.get('/api/dashboard/:classId', (req, res) => {
    const classId = req.params.classId;
    const classStudents = students.filter(s => s.class === classId);
    const totalClassStudents = classStudents.length;
    const paidStudents = classStudents.filter(s => s.paymentStatus === 'paid').length;
    const pendingHW = homework.filter(h => h.class === classId).length;
    const unreadNotifs = notifications.filter(n => n.class === classId || n.class === 'all').length;
    
    res.json({
        totalStudents: totalClassStudents,
        paidStudents: paidStudents,
        pendingHomework: pendingHW,
        unreadNotifications: unreadNotifs,
        paymentRate: totalClassStudents > 0 ? Math.round((paidStudents / totalClassStudents) * 100) : 0
    });
});

// Serve the main HTML file for any other routes (for SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'pi-math-academy.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  Pi Math Academy Server Running!`);
    console.log(`  Developed by Arko`);
    console.log(`  Teacher: Jubair Tushar`);
    console.log(`========================================`);
    console.log(`  Server listening on port ${PORT}`);
    console.log(`  Access application at: http://localhost:${PORT}`);
    console.log(`========================================`);
});