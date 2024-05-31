var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/Students?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  mathScore: { type: Number, required: true },
  physicsScore: { type: Number, required: true },
  chemistryScore: { type: Number, required: true },
});

const Student = mongoose.model("Student", studentSchema, "Student");

/* GET home page. */
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.find();
    if (students.length === 0) {
      return res.render("index", { students: null, title: "Express" });
    }

    res.render("index", { students, title: "Express" });
  } catch (err) {
    next(err);
  }
});

router.get("/add", (req, res, next) => {
  res.render("add", {});
});

router.get("/update/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const studentToUpdate = await Student.findById(id);

    if (studentToUpdate) {
      res.render("update", { studentToUpdate });
    } else {
      res.status(404).send("Không tìm thấy sinh viên");
    }
  } catch (err) {
    next(err);
  }
});

router.get("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (deletedStudent) {
      console.log("Sinh viên đã bị xóa:", deletedStudent);
    } else {
      console.log("Không tìm thấy sinh viên cần xóa");
    }

    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.post("/add_student", async (req, res, next) => {
  try {
    const newStudent = new Student({
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      mathScore: req.body.mathScore,
      physicsScore: req.body.physicsScore,
      chemistryScore: req.body.chemistryScore,
    });
    await newStudent.save();
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.post("/update_student/:id", async (req, res, next) => {
  try {
    const updatedStudent = {
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      mathScore: req.body.mathScore,
      physicsScore: req.body.physicsScore,
      chemistryScore: req.body.chemistryScore,
    };
    await Student.findByIdAndUpdate(req.params.id, updatedStudent);
    console.log("Sinh viên đã được cập nhật:", updatedStudent);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});
module.exports = router;
