const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res, next)=> {
  res.send({
    message: "This is a login/register/update profile api"
  })
})

router.post('/register', (req, res, next)=> {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

router.get('/profile', (req, res, next)=> {
  let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          rreturn res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<h2>Phone: </h2>' + user.phone + '<h2>Country: </h2>' + user.country + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

router.get('/logout', (req, res, next)=> {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

router.post('/profile', (req, res, next)=> {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          let profileData = {
            phone: req.body.phone,
            country: req.body.country
          };
          User.save(profileData, function (error, result) {
            if (error) {
              return next(error);
            } else {
              return res.redirect('/profile');
            }
          });
        }
      }
  });
});



module.exports = router;
