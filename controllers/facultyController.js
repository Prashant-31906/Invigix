// controllers/facultyController.js
const InvigilationDuty = require('../models/InvigilationDuty');
const User = require('../models/user');

// 1. Faculty ka Dashboard dikhana
exports.getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.session.user.id;
    const user = req.session.user; // Session se poori user info
    
    // Faculty ki duties fetch karo
    const duties = await InvigilationDuty.getByFacultyId(facultyId);

    // Date format change karke bhejna (optional)
    const formattedDuties = duties.map(duty => ({
      ...duty,
      duty_date: new Date(duty.duty_date).toLocaleDateString('en-IN')
    }));

    res.render('faculty/dashboard', {
      title: 'Faculty Dashboard',
      user: user,
      duties: formattedDuties
    });
  } catch (err) {
    console.log(err);
    res.redirect('/login');
  }
};

// 2. Faculty ki apni availability change karna
exports.toggleAvailability = async (req, res) => {
  try {
    const facultyId = req.session.user.id;
    const { status } = req.body; // 'true' ya 'false'
    
    const newStatus = status === 'true' ? true : false;
    
    await User.toggleAvailability(facultyId, newStatus);

    // Session me bhi update karo (taaki UI turant refresh ho)
    req.session.user.availability_status = newStatus;
    
    res.redirect('/faculty/dashboard');
  } catch (err) {
    console.log(err);
    res.redirect('/faculty/dashboard');
  }
};