// middleware/authMiddleware.js

exports.isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {

    return res.redirect('/login');
  }
  next(); 
};

exports.isAdmin = (req, res, next) => {
  
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  
  // Check karo role 'admin' hai ya nahi
  if (req.session.user.role !== 'admin') {
    console.log('Access Denied: Not an Admin');
    
    return res.redirect('/'); 
  }
  
 
  next();
};

exports.isFaculty = (req, res, next) => {
 
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  
 
  if (req.session.user.role !== 'faculty') {
    console.log('Access Denied: Not Faculty');
    return res.redirect('/'); 
  }
  
  // Sab theek hai, faculty hai
  next();
};