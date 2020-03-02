const dropZone = require('./functions/drop-zone');
const form = require('./functions/form');
const generateComment = require('./functions/generate-comment');
const sendEmail = require('./functions/send-email');

exports.dropZone = function() {
  dropZone();
  return;
};

exports.form = function() {
  form();
  return;
};

exports.generateComment = function() {
  generateComment();
  return;
};

exports.sendEmail = function() {
  sendEmail();
  return;
};

