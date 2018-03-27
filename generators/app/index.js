'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const tools = require('./tools');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.distComponentPath = path.resolve(this.destinationPath('src/components'));
  }
  prompting() {
    const prompts = [
      {
        type: 'input',
        name: 'componentName',
        message: 'enter the component name',
        required: true,
        validate: v => {
          v = v.trim();

          if (!tools.testName(v)) {
            return `componentName [${v}] is invalid, the test [/^[A-Z][a-zA-Z]*$/] failed`;
          }

          if (tools.fileExist(v, this.distComponentPath)) {
            return `component [${v}] is already existed`;
          }

          return true;
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'enter the component description',
        required: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const { props } = this;
    const toPath = `${this.distComponentPath}/${props.componentName}`;
    let pkg = this.fs.readJSON(this.templatePath('package.json'), {});

    // 处理pkg
    pkg = Object.assign({}, pkg, {
      name: `@tencent/stone-${tools.decamelize(props.componentName, { separator: '-' })}`,
      description: props.description
    });

    this.fs.writeJSON(this.destinationPath(`${toPath}/package.json`), pkg);

    // 处理.gitignore
    this.fs.copyTpl(
      this.templatePath('_gitignore'),
      this.destinationPath(`${toPath}/.gitignore`),
      this.props
    );

    // 处理其他直接拷贝文件
    const files = ['index.js', 'index.css', 'readme.md'];

    files.forEach(item => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(`${toPath}/${item}`),
        this.props
      );
    });
  }
};
