const generateEmail = require('./generate-email');
const dropzone = require('dropzone');

module.exports = async function form() {
  console.log("This is a message from the form part of the demo package");
  generateEmail();
  return;
}
