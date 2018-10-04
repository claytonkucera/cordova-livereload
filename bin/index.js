#! /usr/bin/env node
const server = require('live-server');
const ip = require('my-local-ip');
const port = '8080';
const androidPath = 'platforms/android/platform_www';
const iosPath = 'platforms/ios/www';
const program = require('commander');
let selectedPath = '';
const replace = require('replace');
const path = require('path');

program
  .version('0.1.0')
  .option('-p, --platform [type]', 'specify platform')
  .parse(process.argv);

replace({
  regex: /(<content src=\")(.+)(\" \/>)/g,
  replacement: '$1http://' + ip + ':' + port + '$3',
  paths: ['./config.xml'],
  recursive: true,
  silent: true
});
if (program.platform) {
  if (program.platform === 'android') {
    selectedPath = androidPath;
  } else if (program.platform === 'ios') {
    selectedPath = iosPath;
  }
}

var params = {
  port: 8080, // Set the server port. Defaults to 8080.
  host: ip(), // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  root: './www', // Set root directory that's being served. Defaults to cwd.
  open: false, // When false, it won't load your browser by default.
  file: 'cordova.index.html', // When set, serve this file for every 404 (useful for single-page applications)
  mount: [
    ['/cordova.js', selectedPath + '/cordova.js'],
    ['/cordova_plugins.js', selectedPath + '/cordova_plugins.js'],
    ['/plugins', selectedPath + '/plugins']
    // ['/cordova.js', path.join(__dirname, selectedPath, 'cordova.js')],
    // [
    //   '/cordova_plugins.js',
    //   path.join(__dirname, selectedPath, 'cordova_plugins.js')
    // ],
    // ['/plugins', path.join(__dirname, selectedPath, 'plugins')]
  ], // Mount a directory to a route.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  middleware: [
    function(req, res, next) {
      next();
    }
  ]
};

server.start(params);
