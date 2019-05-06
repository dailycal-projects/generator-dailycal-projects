const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('title', {
      type: String,
      required: true,
      desc: 'Project title',
    });
  }

  prompting() {
    const questions = [
      {
        type: 'confirm',
        name: 'archie',
        message: 'Would you like to include an ArchieML configuration (Google Doc)?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'spreadsheet',
        message: 'Would you like Google Spreadsheet integration?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'ai2html',
        message: 'Would you like to include an ai2html configuration?',
        default: false,
      },
    ];

    return this.prompt(questions).then((answers) => {
      this.archie = answers.archie;
      this.spreadsheet = answers.spreadsheet;
      this.ai2html = answers.ai2html;
    });
  }

  template() {
    this.composeWith(require.resolve('../bundler-webpack'), {
      archie: this.archie,
      spreadsheet: this.spreadsheet
    });
    this.composeWith(require.resolve('../router'), {
      context: true,
    });
    this.composeWith(require.resolve('../gulp-common'));
    this.composeWith(require.resolve('../gulp-statics'));
    this.composeWith(require.resolve('../archie'));
    if (this.spreadsheet) this.composeWith(require.resolve('../spreadsheet'));
    if (this.ai2html) this.composeWith(require.resolve('../ai2html'));
  }

  writing() {
    // Skeleton
    mkdirp('./src/data');
    mkdirp('./dist');
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'), {
        archie: this.archie,
        spreadsheet: this.spreadsheet,
      });
    // Nunjucks templates
    this.fs.copyTpl(
      this.templatePath('src/templates/index.html'),
      this.destinationPath('src/templates/index.html'), {
        ai2html: this.ai2html,
      });
    // Meta
    this.fs.copy(
      this.templatePath('src/templates/meta/_social.html'),
      this.destinationPath('src/templates/meta/_social.html'));
    this.fs.copy(
      this.templatePath('src/templates/meta/_icons.html'),
      this.destinationPath('src/templates/meta/_icons.html'));
    // Partials
    this.fs.copy(
      this.templatePath('src/templates/partials/_breakpoints.html'),
      this.destinationPath('src/templates/partials/_breakpoints.html'));
    this.fs.copy(
      this.templatePath('src/templates/partials/_footer.html'),
      this.destinationPath('src/templates/partials/_footer.html'));
    this.fs.copy(
      this.templatePath('src/templates/partials/_header.html'),
      this.destinationPath('src/templates/partials/_header.html'));
    this.fs.copy(
      this.templatePath('src/templates/partials/_nav.html'),
      this.destinationPath('src/templates/partials/_nav.html'));
    // Sections
    this.fs.copy(
      this.templatePath('src/templates/_sections/text.html'),
      this.destinationPath('src/templates/_sections/text.html'));
    this.fs.copy(
      this.templatePath('src/templates/_sections/section-header.html'),
      this.destinationPath('src/templates/_sections/section-header.html'));
    this.fs.copy(
      this.templatePath('src/templates/_sections/image.html'),
      this.destinationPath('src/templates/_sections/image.html'));
    this.fs.copy(
      this.templatePath('src/templates/_sections/credits.html'),
      this.destinationPath('src/templates/_sections/credits.html'));
    this.fs.copy(
      this.templatePath('src/templates/_sections/d3-graphic.html'),
      this.destinationPath('src/templates/_sections/d3-graphic.html'));
    // Template context
    this.fs.writeJSON('src/data/data.json', {});
    // Images directories
    mkdirp('./src/images');
    this.fs.copy(
      this.templatePath('src/images/sproul.jpg'),
      this.destinationPath('src/images/sproul.jpg'));
    // Javascript
    this.fs.copy(
      this.templatePath('src/js/main-app.js'),
      this.destinationPath('src/js/main-app.js'));
  }

  installing() {
    const dependencies = [
      'gulp-env',
      'node-env-file',
      'run-sequence',
      'secure-keys-dc',
    ];

    this.yarnInstall(dependencies, { dev: true });
  }

  end() {
    this.spawnCommand('gulp');
  }
};
