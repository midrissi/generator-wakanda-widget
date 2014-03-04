'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var pd = require('pretty-data').pd;
var _ = require("underscore");

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

var WakandaExtensionGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require(this.env.cwd + '/package.json');
    this.dpc = _.pluck(this.pkg.loadDependencies);
  },

  askFor: function () {
    var done = this.async();

    var prompts = [{
      name: 'id',
      message: 'The id of the dependency',
      warning: 'Already exists',
      required: true,
      conform: function (value) {
        return this.dpc.indexOf(value) < 0;
      }
    },{
      name: 'studioOnly',
      message: 'Studio only?',
      default: 'false',
      warning: 'Must respond true or false',
      validator: /t[rue]*|f[alse]?/
    },{
      name: 'version',
      message: 'Version of the dependency',
      default: '1.0.0'
    },{
      name: 'path',
      message: 'Path of the dependency',
      default: 'WIDGETS_CUSTOM'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.props.studioOnly = props.studioOnly === 'true';
      this.props.id = this.appname + '/' + props.id;

      done();
    }.bind(this));
  },

  app: function () {
    this.pkg.loadDependencies.push(this.props);
    this.write('package.json', pd.json(this.pkg));
  }
});

module.exports = WakandaExtensionGenerator;