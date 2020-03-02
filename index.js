const openForm = require('./functions/open-form');
const sendEmail = require('./functions/send-email');

exports.openForm = function() {
  openForm();
  return;
};

exports.sendEmail = function() {
  sendEmail();
  return;
};

