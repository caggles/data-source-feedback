const openForm = require('./functions/open-form');
const sendEmail = require('./functions/send-email');
const isOnline = require('./functions/online');

exports.openForm = function() {
  openForm();
};

exports.sendEmail = function() {
  (async () => {
      console.log(await isOnline());
      sendEmail();
  })();
};

