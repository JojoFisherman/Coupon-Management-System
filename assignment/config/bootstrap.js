/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {
  Coupon.findOne(1).exec(function (err, record) {

    if (record == null) {

      var users = [
        { "username": "admin", "password": "123456", "id": 101 },
        { "username": "cyrus", "password": "123456", "id": 102, "coins": 1000 },
        { "username": "eric", "password": "123456", "id": 103, "coins": 1000 }
      ];
      // Load the bcrypt module
      var bcrypt = require('bcrypt');

      // Generate a salt
      var salt = bcrypt.genSaltSync(10);



      var coupons = [
        { "title": "星期一至四晚市85折優惠", "restaurant": "Dacha Restaurant & Bar", "district": "Kowloon", "mall": "海港城", "image": "https://static7.orstatic.com/userphoto/Coupon/0/6R/001C2209EFD635F57CB0D5lv.jpg", "coin": "1111", "date": "04/09/2018", "quota": "11", "details": "憑劵惠顧晚市於星期一至四並消費滿(每位)$250，可享全單85折優惠。" },
        { "title": "午市75折優惠", "restaurant": "丼瀛", "district": "Kowloon", "mall": "又一城", "image": "https://static8.orstatic.com/userphoto/Coupon/0/6R/001C1ZB56F97232DB28D0Blv.jpg", "coin": "2222", "date": "04/07/2018", "quota": "22", "details": "憑券周一至五惠顧午市指定套餐(12:00-16:00)，可享75折優惠。" },
        { "title": "火鍋配料低至7折起", "restaurant": "火鍋煮場", "district": "New Territories", "mall": "荃新天地", "image": "https://static7.orstatic.com/userphoto/Coupon/0/6R/001C1UE61FC9C9E1C765D2lv.jpg", "coin": "400", "date": "04/05/2018", "quota": "1", "details": "凡惠顧火鍋配料於9時前離座專享8折, 凡9時後入座火鍋配料專享7折。" },
        { "title": "超值價$268嘆鴻運百鮮自助晚餐 小童半價", "restaurant": "雅敍閣西餐廳", "district": "New Territories", "mall": "屯門市廣場", "image": "https://static8.orstatic.com/userphoto/Coupon/0/6Q/001BSZA1BEA0E9D13C17B7lv.jpg", "coin": "500", "date": "04/08/2018", "quota": "44", "details": "憑券可以驚喜優惠價$268於星期一至日享用鴻運百鮮自助晚餐，小童可享半價優惠。當月生日之星可獲贈1磅生日蛋糕，必須兩天前預訂。" },
        { "title": "$100優惠劵", "restaurant": "韓舍", "district": "HK Island", "mall": "銅鑼灣世貿中心", "image": "https://static8.orstatic.com/userphoto/Coupon/0/6P/001BQJ9EEDA18E7947C037lv.jpg", "coin": "5555", "date": "05/05/2018", "quota": "55", "details": "憑劵於惠顧韓舍晚市4位或以上，即可減$100。" }
      ];

      coupons.forEach(function (coupon) {
        Coupon.create(coupon).exec(function (err, record) { });
      });

      users.forEach(function (user) {
        user.password = bcrypt.hashSync(user.password, salt);
        User.create(user).exec(function (err, model) {
          if (model.id == 102) {
            model.redeems.add(1);
            model.redeems.add(2);
          }

          model.save();
        });
      });


    }

  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
