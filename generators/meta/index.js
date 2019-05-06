const Generator = require('yeoman-generator');
const S = require('slugify');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('title', {
      type: String,
      required: true,
      desc: 'Project title',
    });
  }

  writing() {
    this.title = this.options.title;
    this.slug = S(this.title);

    const timestamp = new Date();
    const publishPath = `${timestamp.getFullYear()}/${this.slug}/`;
    const prodUrl = `http://projects.dailycal.org/${publishPath}`;
    const stagingUrl = `http://stage-projects.dailycal.org/${publishPath}index.html`;

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('./.gitignore'));

    this.fs.copy(
      this.templatePath('LICENSE'),
      this.destinationPath('LICENSE'));

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'), {
        slug: this.slug,
        userName: this.user.git.name(),
        userEmail: this.user.git.email(),
      });

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'), {
        slug: this.slug,
        title: this.title,
        userName: this.user.git.name(),
        userEmail: this.user.git.email(),
        url: prodUrl,
        year: timestamp.getFullYear(),
      });

    const metaJSON = {
      id: (Math.floor(Math.random() * 100000000000) + 1).toString(),
      publishPath,
      stagingUrl,
      url: prodUrl,
      timestamp: '2018-04-10T08:13-0400',
      dateline: '04/10/18 08:13 PM EDT',
      header: {
        headline: 'This is your headline in the metadata file',
        subhed: 'Subhed lives in the metadata.',
        byline: 'Byline in metadata',
        byline_link: 'https://www.dailycal.org/',
      },
      share: {
        fbook: {
          card_title: this.title,
          card_description: 'UC Berkeley\'s independent student-run newspaper',
          author: 'dailycal',
        },
        twitter: {
          card_title: this.title,
          share_tweet: 'UC Berkeley\'s independent student-run newspaper',
          card_description: 'The latest news from The Daily Californian.',
          author: '@dailycal',
        },
        image: {
          url: `${prodUrl}images/share.jpg`,
          alt: '<Text>',
          type: 'image/jpeg',
          width: '600',
          height: '300',
        },
        keywords: 'Daily Cal, news',
      }
    };

    this.fs.writeJSON('meta.json', metaJSON);
  }
};
