'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var handlebars = require("handlebars");
var _ = require("underscore");

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// just a test

var WakandaExtensionGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.readFileAsString(path.join(this.sourceRoot(), 'intro.txt')));

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using WakandaExtension generator.'));

    var prompts = [{
      name: 'name',
      message: 'Enter the name of your widget',
      default: this.appname
    },{
      name: 'category',
      message: 'In which category you want to include your widget?',
      default: 'Custom Widgets'
    },{
      name: 'author',
      message: 'Author of the widget',
      default: 'Widget Developer'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.props.cName = capitalize(props.name);

      done();
    }.bind(this));
  },

  app: function () {
    var 
      dirs = ['css', 'icons'],
      files = [{
        name: 'designer.js',
        template: true,
        path: 'designer.js'
      },{
        name: '_package.json',
        template: true,
        path: 'package.json'
      },{
        name: 'README.md',
        template: false,
        path: 'README.md'
      },{
        name: 'widget.js',
        template: true,
        path: 'widget.js'
      },{
        name: 'css/widget.css',
        template: true,
        path: 'css/widget.css',
        config: function () {
          var _props = _.clone(this.props);
          _props.name = _props.name.toLowerCase();

          return _props;
        }
      },{
        name: 'icons/widget.png',
        template: false,
        path: 'icons/widget.png'
      }];

    for (var i = dirs.length - 1; i >= 0; i--) {
      this.mkdir(dirs[i]);
    };

    for (var i = files.length - 1; i >= 0; i--) {
      var f = files[i];
      
      if(f.template){
        var content = this.readFileAsString(path.join(this.sourceRoot(), f.name));
        var template = handlebars.compile(content);
        this.write(f.path, template(_.isFunction(f.config)? f.config.call(this):this.props));
      }else{
        this.copy(f.name, f.path);
      }
    };
  }
});

module.exports = WakandaExtensionGenerator;