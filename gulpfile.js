'use strict';
const path = require('path');
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const excludeGitignore = require('gulp-exclude-gitignore');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const nsp = require('gulp-nsp');
const plumber = require('gulp-plumber');

gulp.task('static', () => {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', cb => {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', () => {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], () => {
  gulp.src(['api/**/*.spec.js', 'api/**/*.integration.js', 'test/**/*.js'])
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .once('error', () => {
      process.exit(1);
    })
    .pipe(istanbul.writeReports())
    .once('end', () => {
      process.exit();
    });
});

gulp.task('watch', () => {
  gulp.watch('**/*.js', ['test']);
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test']);
