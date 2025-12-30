// controllers/adminController.js
const Student = require('../models/Student');
const Classroom = require('../models/Classroom'); // Naya import
const Exam = require('../models/Exam'); // Naya import
const SeatingPlan = require('../models/SeatingPlan'); 
const User = require('../models/user');
const InvigilationDuty = require('../models/InvigilationDuty');
// Admin Dashboard
exports.getDashboard = (req, res) => {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    user: req.session.user
  });
};

// --- Student Controller Logic ---

// 1. Saare Students Dikhana
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.getAll();
    res.render('admin/students', {
      title: 'Manage Students',
      user: req.session.user,
      students: students
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/dashboard');
  }
};

// 2. Add Student ka Form Dikhana
exports.getAddStudentForm = (req, res) => {
  res.render('admin/add-student', {
    title: 'Add New Student',
    user: req.session.user
  });
};

// 3. Naya Student Add Karna (Form se data)
exports.postAddStudent = async (req, res) => {
  try {
    const { roll_no, name, course, semester } = req.body;
    await Student.create(roll_no, name, course, semester);
    console.log('Student add ho gaya');
    res.redirect('/admin/students');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/students/add');
  }
};

// 4. Edit Student ka Form Dikhana
exports.getEditStudentForm = async (req, res) => {
  try {
    const student = await Student.getById(req.params.id);
    if (!student) {
      return res.redirect('/admin/students');
    }
    res.render('admin/edit-student', {
      title: 'Edit Student',
      user: req.session.user,
      student: student
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/students');
  }
};

// 5. Student ko Update Karna
exports.postEditStudent = async (req, res) => {
  try {
    const { id, roll_no, name, course, semester } = req.body;
    await Student.updateById(id, roll_no, name, course, semester);
    console.log('Student update ho gaya');
    res.redirect('/admin/students');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/students');
  }
};

// 6. Student ko Delete Karna
exports.deleteStudent = async (req, res) => {
  try {
    await Student.deleteById(req.params.id);
    console.log('Student delete ho gaya');
    res.redirect('/admin/students');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/students');
  }
};

exports.getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.getAll();
    res.render('admin/classrooms', {
      title: 'Manage Classrooms',
      user: req.session.user,
      classrooms: classrooms
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/dashboard');
  }
};

exports.getAddClassroomForm = (req, res) => {
  res.render('admin/add-classroom', {
    title: 'Add New Classroom',
    user: req.session.user
  });
};

exports.postAddClassroom = async (req, res) => {
  try {
    const { room_number, capacity } = req.body;
    await Classroom.create(room_number, capacity);
    res.redirect('/admin/classrooms');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/classrooms/add');
  }
};

exports.getEditClassroomForm = async (req, res) => {
  try {
    const classroom = await Classroom.getById(req.params.id);
    if (!classroom) {
      return res.redirect('/admin/classrooms');
    }
    res.render('admin/edit-classroom', {
      title: 'Edit Classroom',
      user: req.session.user,
      classroom: classroom
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/classrooms');
  }
};

exports.postEditClassroom = async (req, res) => {
  try {
    const { id, room_number, capacity } = req.body;
    await Classroom.updateById(id, room_number, capacity);
    res.redirect('/admin/classrooms');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/classrooms');
  }
};

exports.deleteClassroom = async (req, res) => {
  try {
    await Classroom.deleteById(req.params.id);
    res.redirect('/admin/classrooms');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/classrooms');
  }
};

// --- Exam Controller Logic ---

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.getAll();
    // Date format change karke bhejna (optional, but good for UI)
    const formattedExams = exams.map(exam => ({
        ...exam,
        exam_date: new Date(exam.exam_date).toLocaleDateString('en-IN') // DD-MM-YYYY
    }));
    res.render('admin/exams', {
      title: 'Manage Exams',
      user: req.session.user,
      exams: formattedExams
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/dashboard');
  }
};

exports.getAddExamForm = (req, res) => {
  res.render('admin/add-exam', {
    title: 'Schedule New Exam',
    user: req.session.user
  });
};

exports.postAddExam = async (req, res) => {
  try {
    const { subject_name, subject_code, course, semester, exam_date, start_time } = req.body;
    await Exam.create(subject_name, subject_code, course, semester, exam_date, start_time);
    res.redirect('/admin/exams');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/exams/add');
  }
};

exports.getEditExamForm = async (req, res) => {
  try {
    const exam = await Exam.getById(req.params.id);
    if (!exam) {
      return res.redirect('/admin/exams');
    }
    // HTML date input ke liye YYYY-MM-DD format chahiye
    exam.exam_date_formatted = new Date(exam.exam_date).toISOString().split('T')[0];
    
    res.render('admin/edit-exam', {
      title: 'Edit Exam',
      user: req.session.user,
      exam: exam
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/exams');
  }
};

exports.postEditExam = async (req, res) => {
  try {
    const { id, subject_name, subject_code, course, semester, exam_date, start_time } = req.body;
    await Exam.updateById(id, subject_name, subject_code, course, semester, exam_date, start_time);
    res.redirect('/admin/exams');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/exams');
  }
};

exports.deleteExam = async (req, res) => {
  try {
    await Exam.deleteById(req.params.id);
    res.redirect('/admin/exams');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/exams');
  }
};


exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.getAll();
    // Date format change karke bhejna (optional, but good for UI)
    const formattedExams = exams.map(exam => ({
        ...exam,
        exam_date: new Date(exam.exam_date).toLocaleDateString('en-IN') // DD-MM-YYYY
    }));
    res.render('admin/exams', {
      title: 'Manage Exams',
      user: req.session.user,
      exams: formattedExams
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/dashboard');
  }
};

exports.getAddExamForm = (req, res) => {
  res.render('admin/add-exam', {
    title: 'Schedule New Exam',
    user: req.session.user
  });
};

exports.postAddExam = async (req, res) => {
  try {
    const { subject_name, subject_code, course, semester, exam_date, start_time } = req.body;
    await Exam.create(subject_name, subject_code, course, semester, exam_date, start_time);
    res.redirect('/admin/exams');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/exams/add');
  }
};

exports.getEditExamForm = async (req, res) => {
  try {
    const exam = await Exam.getById(req.params.id);
    if (!exam) {
      return res.redirect('/admin/exams');
    }
    // HTML date input ke liye YYYY-MM-DD format chahiye
    exam.exam_date_formatted = new Date(exam.exam_date).toISOString().split('T')[0];
    
    res.render('admin/edit-exam', {
      title: 'Edit Exam',
      user: req.session.user,
      exam: exam
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/exams');
  }
};

exports.postEditExam = async (req, res) => {
  try {
    const { id, subject_name, subject_code, course, semester, exam_date, start_time } = req.body;
    await Exam.updateById(id, subject_name, subject_code, course, semester, exam_date, start_time);
    res.redirect('/admin/exams');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/exams');
  }
};

exports.deleteExam = async (req, res) => {
  try {
    await Exam.deleteById(req.params.id);
    res.redirect('/admin/exams');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/exams');
  }
};

exports.getSeatingPlanPage = async (req, res) => {
  try {
    const { date, time } = req.query;
    let plan = [];

    if (date && time) {
      plan = await SeatingPlan.getPlanByDateTime(date, time);
    }

    res.render('admin/seating-plan', {
      title: 'Seating Arrangement',
      user: req.session.user,
      plan: plan, // Generated plan
      selectedDate: date,
      selectedTime: time
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/dashboard');
  }
};

// 2. Algorithm Chalaana aur Plan Generate Karna
exports.generateSeatingPlan = async (req, res) => {
  const { exam_date, start_time } = req.body;
  
  try {
    // Step 1: Purana plan delete karo (agar hai)
    await SeatingPlan.deleteByDateTime(exam_date, start_time);

    // Step 2: Input data fetch karo
    const exams = await Exam.getByDateTime(exam_date, start_time);
    const classrooms = await Classroom.getAll();

    if (exams.length === 0) {
      console.log('Us time par koi exam nahi hai');
      return res.redirect(`/admin/seating-plan?date=${exam_date}&time=${start_time}`);
    }
    if (classrooms.length === 0) {
      console.log('Koi classroom added nahi hai');
      return res.redirect('/admin/classrooms');
    }

    // Step 3: Saare students ko fetch karo
    let allStudentsData = []; // [[student, exam_id], [student, exam_id], ...]
    let totalStudents = 0;

    for (const exam of exams) {
      const students = await Student.getByCourseAndSemester(exam.course, exam.semester);
      totalStudents += students.length;
      
      students.forEach(student => {
        allStudentsData.push({ 
          student_id: student.id, 
          exam_id: exam.id 
        });
      });
    }

    // Step 4: Total capacity check karo
    const totalCapacity = classrooms.reduce((acc, room) => acc + room.capacity, 0);
    if (totalStudents > totalCapacity) {
      console.log('Students zyada hain capacity kam hai!');
      // Error message flash karna behtar hoga
      return res.redirect(`/admin/seating-plan?date=${exam_date}&time=${start_time}`);
    }

    // Step 5: Algorithm - Students ko mix karke rooms me assign karo
    // Note: Abhi simple mixing ke liye shuffle kar dete hain
    // (Aap yahan par aur complex logic laga sakte hain, jaise B.Tech, BBA, B.Tech, BBA)
    
    // Simple shuffle logic (Fisher-Yates)
    for (let i = allStudentsData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allStudentsData[i], allStudentsData[j]] = [allStudentsData[j], allStudentsData[i]];
    }

    let planToSave = []; // [[student_id, exam_id, classroom_id, seat_number], ...]
    let studentIndex = 0;

    for (const room of classrooms) {
      for (let seat = 1; seat <= room.capacity; seat++) {
        if (studentIndex < allStudentsData.length) {
          const studentData = allStudentsData[studentIndex];
          planToSave.push([
            studentData.student_id,
            studentData.exam_id,
            room.id,
            seat // Seat number
          ]);
          studentIndex++;
        } else {
          break; // Saare students baith gaye
        }
      }
      if (studentIndex >= allStudentsData.length) {
        break; // Saare students baith gaye
      }
    }

    // Step 6: Naya plan bulk me save karo
    if (planToSave.length > 0) {
      await SeatingPlan.createBulk(planToSave);
      console.log(`${planToSave.length} seats assign ho gayi.`);
    }

    // Wapas usi page par redirect karo
    res.redirect(`/admin/seating-plan?date=${exam_date}&time=${start_time}`);

  } catch (err) {
    console.log(err);
    res.redirect('/admin/seating-plan');
  }
};

// 3. Plan ko Clear Karna
exports.clearSeatingPlan = async (req, res) => {
    const { exam_date, start_time } = req.body;
    try {
        const deletedRows = await SeatingPlan.deleteByDateTime(exam_date, start_time);
        console.log(`${deletedRows} plan entries delete ho gayi.`);
        res.redirect(`/admin/seating-plan?date=${exam_date}&time=${start_time}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/admin/seating-plan?date=${exam_date}&time=${start_time}`);
    }
};

exports.getFacultyList = async (req, res) => {
  try {
    const faculty = await User.getAllFaculty();
    res.render('admin/faculty', {
      title: 'Manage Faculty',
      user: req.session.user,
      faculty: faculty
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/faculty');
  }
};

exports.toggleFacultyAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'true' ya 'false' (string)
    
    // String ko boolean me convert karo
    const newStatus = status === 'true' ? true : false;
    
    await User.toggleAvailability(id, newStatus);
    res.redirect('/admin/faculty');
  } catch (err) {
    console.log(err);
    res.redirect('/admin/faculty');
  }
};

// --- Invigilation Duty Logic ---

exports.getInvigilationPage = async (req, res) => {
  try {
    const { date, time } = req.query;
    let duties = [];

    if (date && time) {
      duties = await InvigilationDuty.getByDateTime(date, time);
    }
    
    res.render('admin/invigilation', {
      title: 'Invigilation Duties',
      user: req.session.user,
      duties: duties,
      selectedDate: date,
      selectedTime: time
    });
  } catch (err) {
    console.log(err);
    res.redirect('/admin/invigilation');
  }
};

exports.generateInvigilationDuties = async (req, res) => {
  const { exam_date, start_time } = req.body;
  try {
    // 1. Purani duties delete karo
    await InvigilationDuty.deleteByDateTime(exam_date, start_time);

    // 2. Data fetch karo
    const exams = await Exam.getByDateTime(exam_date, start_time);
    if (exams.length === 0) {
      console.log('Is slot ke liye koi exam nahi');
      return res.redirect(`/admin/invigilation?date=${exam_date}&time=${start_time}`);
    }
    // "Representative" exam_id (Schema ki wajah se zaroori)
    const representativeExamId = exams[0].id;
    
    const usedClassrooms = await SeatingPlan.getUsedClassroomsByDateTime(exam_date, start_time);
    const availableFaculty = await User.getAvailableFaculty(); // [{id: 1}, {id: 3}, ...]

    if (usedClassrooms.length === 0) {
      console.log('Is slot ke liye koi seating plan nahi bana');
      return res.redirect(`/admin/invigilation?date=${exam_date}&time=${start_time}`);
    }
    if (availableFaculty.length === 0) {
      console.log('Koi faculty available nahi hai');
      return res.redirect(`/admin/invigilation?date=${exam_date}&time=${start_time}`);
    }

    // 3. Algorithm: Har room ko ek faculty assign karo (Round-Robin)
    let dutiesToSave = []; // [[faculty_id, exam_id, classroom_id, duty_date], ...]
    let facultyIndex = 0;

    for (const classroomId of usedClassrooms) {
      // Faculty assign karo
      const faculty = availableFaculty[facultyIndex];
      
      dutiesToSave.push([
        faculty.id,
        representativeExamId, // Slot representative
        classroomId,
        exam_date
      ]);

      // Index ko rotate karo
      facultyIndex = (facultyIndex + 1) % availableFaculty.length;
    }

    // 4. Duties ko DB me save karo
    if (dutiesToSave.length > 0) {
      await InvigilationDuty.createBulk(dutiesToSave);
      console.log(`${dutiesToSave.length} duties assign ho gayi.`);
    }

    res.redirect(`/admin/invigilation?date=${exam_date}&time=${start_time}`);

  } catch (err) {
    console.log(err);
    res.redirect('/admin/invigilation');
  }
};

exports.clearInvigilationDuties = async (req, res) => {
    const { exam_date, start_time } = req.body;
    try {
        await InvigilationDuty.deleteByDateTime(exam_date, start_time);
        res.redirect(`/admin/invigilation?date=${exam_date}&time=${start_time}`);
    } catch (err) {
        console.log(err);
        res.redirect(`/admin/invigilation?date=${exam_date}&time=${start_time}`);
    }
};