const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1 },
    course: { type: String, required: true, trim: true }
});

const Student = mongoose.model("Student", studentSchema);

// CREATE
app.post("/students", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
