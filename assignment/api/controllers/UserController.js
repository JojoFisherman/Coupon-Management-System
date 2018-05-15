/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  redeem: function (req, res) {
    if (req.method == 'GET') {
      return res.redirect('/');
    }
    else {
      User.findOne(req.session._id).exec(function (err, model) {
        if (model !== null) {
          // Check if user has enough coins
          if (model.coins < req.body.coin) {
            return res.send("You don't have enough coins to redeem the coupon");
          }

          // Deduct coins from user and add association
          model.coins -= req.body.coin;
          model.redeems.add(req.body.id);
          model.save();

          // Deduct quota from coupon
          Coupon.findOne(req.body.id).exec(function (err, coupon) {
            coupon.quota = (Number(coupon.quota) - 1).toString();
            coupon.save()
            return res.send("redeemed successfully.");
          });
        }

        else {
          return res.send("unsuccessful, please try again!");
        }
      });
    }
  },


  toJSON: function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
  },

  myCoupons: function (req, res) {

    User.findOne({ username: req.session.username }).populateAll({ sort: 'date asc' }).exec(function (err, model) {
      if (model == null) {
        return res.view('user/myCoupons', { 'coupons': new Array(1), 'coins': model.coins });
      }
      for (let i = 0; i < model.redeems.length; i++) {
        model.redeems[i].date = getDisplayFormatedDate(model.redeems[i]);
      }
      return res.view('user/myCoupons', { 'coupons': model.redeems, 'coins': model.coins });
    });
  },



  login: function (req, res) {

    if (req.method == "GET")
      return res.view('user/login');
    else {
      User.findOne({ username: req.body.username }).exec(function (err, user) {

        if (user == null)
          return res.send("No such user");

        // Load the bcrypt module
        var bcrypt = require('bcrypt');

        // Generate a salt
        var salt = bcrypt.genSaltSync(10);

        //  if (user.password != req.body.password)
        if (!bcrypt.compareSync(req.body.password, user.password))
          return res.send("Wrong Password");


        req.session.regenerate(function (err) {
          req.session.username = req.body.username;
          req.session._id = user.id;
          return res.send('login successfully.');
        });
      });
    }
  },

  logout: function (req, res) {
    req.session.destroy(function (err) {
      return res.redirect("/");
    });
  },
};

function prefix(input) {
  if (input < 10) {
    input = '0' + input;
  }
  return input;
}

function getDisplayFormatedDate(coupon) {
  let year = coupon.date.getFullYear();
  let month = prefix(coupon.date.getMonth() + 1)
  let day = prefix(coupon.date.getDate())

  return month + '/' + day + '/' + year
}