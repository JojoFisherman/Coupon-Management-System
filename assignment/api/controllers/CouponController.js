/**
 * CouponController
 *
 * @description :: Server-side logic for managing Coupons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  members: function (req, res) {
    Coupon.findOne({ id: req.params.id }).populateAll().exec(function (err, model) {
      if (model == null) {
        return res.view('coupon/members', { 'members': new Array(1), });
      }

      return res.view('coupon/members', { 'members': model.ownsBy });
    });
  },

  search: function (req, res) {
    if (req.method === 'POST') {
      const qDate = (req.body.Coupon.date !== '') ? new Date(req.body.Coupon.date) : new Date();
      const qDistrict = req.body.Coupon.district || '';
      const qCoin_low = req.body.Coupon.coin_low || '';
      const qCoin_high = req.body.Coupon.coin_high || '';
      const qPage = req.query.page || 1;

      if (req.body.Coupon.district == 'All Districts') {
        Coupon.find().where({ coin: { '>=': Number(req.body.Coupon.coin_low), '<=': Number(req.body.Coupon.coin_high) } })
          .where({ date: { '>=': qDate } })
          .paginate({ page: qPage, limit: 2 }).exec(function (err, coupons) {
            if (coupons.length == 0) {
              return res.view('coupon/search', { 'coupons': undefined, 'selected': req.body.Coupon });
            }
            Coupon.find().where({ coin: { '>=': Number(req.body.Coupon.coin_low), '<=': Number(req.body.Coupon.coin_high) } })
              .where({ date: { '>=': qDate } })
              .exec(function (err, value) {
                let pages = Math.ceil(value.length / 2);
                return res.view('coupon/search', { 'coupons': coupons, 'count': pages, 'selected': req.body.Coupon });
              });
          });

      } else {
        Coupon.find().where({ coin: { '>=': Number(req.body.Coupon.coin_low), '<=': Number(req.body.Coupon.coin_high) } })
          .where({ 'district': req.body.Coupon.district })
          .where({ date: { '>=': qDate } })
          .paginate({ page: qPage, limit: 2 }).exec(function (err, coupons) {
            if (coupons.length == 0) {
              return res.view('coupon/search', { 'coupons': undefined, 'selected': req.body.Coupon });
            }
            Coupon.find().where({ coin: { '>=': Number(req.body.Coupon.coin_low), '<=': Number(req.body.Coupon.coin_high) } })
              .where({ 'district': req.body.Coupon.district })
              .where({ date: { '>=': qDate } })
              .exec(function (err, value) {
                let pages = Math.ceil(value.length / 2);
                return res.view('coupon/search', { 'coupons': coupons, 'count': pages, 'selected': req.body.Coupon });
              });
          });
      }

    } else {
      return res.view('coupon/search', { 'coupons': undefined, 'selected': undefined });
    }
  },

  delete: function (req, res) {
    if (req.method == 'GET') {
      res.redirect('/');
    }
    else {
      Coupon.findOne(req.params.id).exec(function (err, coupon) {
        if (coupon != null) {
          coupon.destroy();
          return res.send('Coupon Deleted');
        } else {
          return res.send('Coupon not found');
        }
      });
    }
  },

  update: function (req, res) {
    if (req.method == 'GET') {
      Coupon.findOne(req.params.id).exec(function (err, coupon) {
        if (coupon == null) {
          return res.send('No such coupon!');
        } else {
          coupon.date = getHtmlFormatedDate(coupon);
          return res.view('coupon/update', { 'coupon': coupon });
        }
      });
    } else {
      Coupon.findOne(req.params.id).exec(function (err, coupon) {
        coupon.title = req.body.Coupon.title;
        coupon.district = req.body.Coupon.district;
        coupon.mall = req.body.Coupon.mall;
        coupon.image = req.body.Coupon.image;
        coupon.coin = req.body.Coupon.coin;
        coupon.date = req.body.Coupon.date;
        coupon.quota = req.body.Coupon.quota;
        coupon.details = req.body.Coupon.details;
        coupon.save();
        return res.send('Record updated');
      });
    }
  },

  admin: function (req, res) {
    Coupon.find().sort('id asc').exec(function (err, coupons) {
      return res.view('coupon/admin', { 'coupons': coupons });
    });
  },

  detail: function (req, res) {
    Coupon.findOne(req.params.id).populateAll({ 'id': req.session._id }).exec(function (err, coupon) {
      var redeemed = coupon.ownsBy.length > 0;
      if (coupon == null) {
        return res.send('No such coupon');
      } else {
        coupon.date = getDisplayFormatedDate(coupon);
        return res.view('coupon/detail', { 'coupon': coupon, 'redeemed': redeemed });
      }
    });
  },

  index: function (req, res) {
    Coupon.find({
      where: { district: 'HK Island', quota: { '>=': 1 } },
      limit: 2,
      sort: 'id DESC',
    }).exec(function (err, hk_coupons) {
      Coupon.find({
        where: { district: 'Kowloon', quota: { '>=': 1 } },
        limit: 2,
        sort: 'id DESC',
      }).exec(function (err, kn_coupons) {
        Coupon.find({
          where: { district: 'New Territories', quota: { '>=': 1 } },
          limit: 2,
          sort: 'id DESC',
        }).exec(function (err, nt_coupons) {
          return res.view('coupon/home', {
            'hk_coupons': hk_coupons,
            'kn_coupons': kn_coupons,
            'nt_coupons': nt_coupons
          });
        });
      });
    });
  },

  create: function (req, res) {
    if (req.method == 'POST') {
      Coupon.create(req.body.Coupon).exec(function (err, coupon) {
        return res.send('Successfully Created!');
      });
    } else {
      return res.view('coupon/create');
    }
  },

  // json function
  json: function (req, res) {
    Coupon.find().exec(function (err, coupons) {
      return res.json(coupons);
    });
  },
};

function prefix(input) {
  if (input < 10) {
    input = '0' + input;
  }
  return input;
}

function getHtmlFormatedDate(coupon) {
  let year = coupon.date.getFullYear();
  let month = prefix(coupon.date.getMonth() + 1)
  let day = prefix(coupon.date.getDate())

  return year + '-' + month + '-' + day
}

function getDisplayFormatedDate(coupon) {
  let year = coupon.date.getFullYear();
  let month = prefix(coupon.date.getMonth() + 1)
  let day = prefix(coupon.date.getDate())

  return month + '/' + day + '/' + year
}