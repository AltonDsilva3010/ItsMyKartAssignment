const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student.js");

//@route POST /students
//@desc  Register student with Name, Roll No. and Password
//@access Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("rollno", "Rollno should be a four digit number").isLength({
      min: 4,
    }),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, rollno, password } = req.body;

    try {
      //see if the student exists
      let student = await Student.findOne({ rollno });

      if (student) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Student already exists" }] });
      }

      student = new Student({
        name,
        rollno,
        password,
      });

      //Encrypt the password

      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(password, salt);

      await student.save();
      return res.json(student);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

//@route GET /students
//@desc get student data using rollno
//@access Public

router.get(
  "/",
  [check("rollno", "Please enter a valid rollno.").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { rollno } = req.body;

    try {
      let student = await Student.findOne({ rollno });

      if (!student) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Student does not exist" }] });
      } else {
        return res.json(student);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

//@route PUT /students
//@desc update student name / add marks using roll no
//@access Public

router.put(
  "/",
  [check("rollno", "Please enter a valid rollno.").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, rollno, password, marks } = req.body;
    try {
      let student = await Student.findOne({ rollno });
      if (!student) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Student does not exist" }] });
      }

      if (name) {
        student.name = name;
      }

      if (marks) {
        let studentmarks = student.marks;
        marks.map((mark) => {
          studentmarks.push(mark);
        });
        student.marks = studentmarks;
      }

      await student.save();

      return res.json(student);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

//@route DELETE /students
//@desc delete student from database
//@access Public
router.delete(
  "/",
  [check("rollno", "Please enter a valid rollno.").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rollno } = req.body;

    try {
      let student = await Student.findOne({ rollno });

      if (!student) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Student does not exist" }] });
      }

      await Student.findOneAndRemove({ rollno });

      res.json({ msg: "Student Deleted from Database" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
