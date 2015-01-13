/*jslint node: true*/

'use strict';

var nodemailer = require('nodemailer');
var c = require('nconf');

c.env().file('config.json');

var debugEmail = c.get('DEBUG_EMAIL');

var smtp = nodemailer.createTransport('SMTP', {
  service: 'SendGrid',
  auth: {
    user: c.get('SENDGRID_USER'),
    pass: c.get('SENDGRID_PASS')
  }
});

var options = {
  from: 'CSG Notification <noreply@csgpro.com>'
  // to: 'jondlm@gmail.com,jond@csgpro.com',
  // subject: 'Test Subject',
  // text: 'Here is a plain text body'
};

/**
 * Sends an email
 * @param  {String}   to       Comma separated list of recipients
 * @param  {String}   subject  Email subject
 * @param  {String}   body     Html or plain text email body
 * @param  {Boolean}  isHtml   Is the body HTML? If `false` then plaintext
 * @param  {Function} callback Callback with (err, success)
 * @param  {String}   from     From address (example: 'CSG Pro <noreply@csgpro.com>')
 */
exports.sendEmail = function (to, replyTo, subject, body, isHtml, callback, from) {

  var o = {
    from: options.from,
    to: to,
    subject: subject
  };

  if (debugEmail) {
      o.to = debugEmail;
  }

  if (from) {
    o.from = from;
  }

  if (replyTo) {
    o.replyTo = replyTo;
  }

  if (isHtml) {
    o.html = body;
  } else {
    o.text = body;
  }

  smtp.sendMail(o, function(err, response) {
    if (err) {
      callback(err, false);
    } else {
      callback(null, true);
    }
  });

};
