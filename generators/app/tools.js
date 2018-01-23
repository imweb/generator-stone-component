'use strict';

const fs = require('fs');

// String conversion methods
function separateWords(string, options) {
  options = options || {};
  const separator = options.separator || '_';
  const split = options.split || /(?=[A-Z])/;

  return string.split(split).join(separator);
}

module.exports = {
  notEmpty: v => {
    return `${v}`.trim().length > 0;
  },
  testName: name => {
    return /^[A-Z][a-zA-Z]*$/.test(name);
  },
  fileExist: (name, dirPath) => {
    let dirInfo;

    try {
      dirInfo = fs.readdirSync(dirPath);
    } catch (e) {
      // 要检测的冲突目录不存在，直接返回“无冲突”
      return false;
    }

    return dirInfo.indexOf(name) > -1;
  },
  decamelize: (string, options) => {
    return separateWords(string, options).toLowerCase();
  }
};
