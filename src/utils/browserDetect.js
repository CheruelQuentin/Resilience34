const { detect } = require('detect-browser');
const browser = detect();

// handle the case where we don't detect the browser
if (browser) {
  console.log(browser.name);
  console.log(browser.version);
  console.log(browser.os);
  
}
const detection = () => {
  nom = browser.name
  version = browser.version
  os = browser.os
    return nom
}

module.exports = detection