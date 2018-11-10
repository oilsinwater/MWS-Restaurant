/**
 * Gulp config
 */

// Load plugins
let gulp = require('gulp');
let gulpLoadPlugins = require('gulp-load-plugins');
let del = require('del');
let browserSync = require('browser-sync').create();
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let runSequence = require('run-sequence');
let lazypipe = require('lazypipe');
let imageminPngquant = require('imagemin-pngquant');
let imagemin = require('gulp-imagemin');

let $ = gulpLoadPlugins();
let reload = browserSync.reload;

// // declare and assign paths
// const paths = {
//   notNode: '!node_modules/**',

//   src: 'src/',
//   srcHTML: 'src/*.html',
//   srcCSS: 'src/css/*.css',
//   srcJS: 'src/js/*.js',

//   tmp: '.tmp/', // tmp folder
//   tmpIndex: '.tmp/index.html', // index.html tmp folder
//   tmpCSS: '.tmp/**/*.css', // css files in .tmp folder
//   tmpJS: '.tmp/**/*.js', // js files in .tmp folder

//   dist: 'dist/',
//   distIndex: 'dist/index.html',
//   distCSS: 'dist/**/*.css',
//   distJS: 'dist/**/*.js'
// };

// lint
gulp.task('lint', () => {
  return gulp
    .src(['src/**/*.js', '!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

// clear files from temp
gulp.task('clear', () => {
  del(['.tmp/**/*']);
});

// clear files from dist
gulp.task('clear:dist', () => {
  return del(['dist/**/*']);
});

// Signature start
gulp.task('start', () => {
  console.log('ssssip...ssssssip....sssssssssip ');
});

// Signature finish
gulp.task('neck', () => {
  console.log('...GUUULP!!');
});

// Watch changes and reload
gulp.task('serve', () => {
  runSequence(
    ['clear', 'start', 'images', 'lint', 'sw', 'html', 'manifest'],
    () => {
      browserSync.init({
        server: '.tmp',
        port: 3030
      });
      // watch
      gulp.watch(['src/*.html'], ['html', reload]);
      gulp.watch(['src/css/*.css'], ['html', reload]);
      gulp.watch(['src/js/*.js'], ['lint', 'html', reload]);
      gulp.watch(['src/sw.js'], ['lint', 'sw', reload]);
      gulp.watch(['src/manifest.json'], ['manifest', reload]);
    }
  );
});

// Bundle and serve the optimized site
gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    server: 'dist',
    port: 3031
  });

  gulp.watch(['src/*.html'], ['html:dist', reload]);
  gulp.watch(['src/css/*.css'], ['html:dist', reload]);
  gulp.watch(['src/js/*.js'], ['lint', 'html:dist', reload]);
  gulp.watch(['src/sw.js'], ['lint', 'sw:dist', reload]);
  gulp.watch(['src/manifest.json'], ['manifest:dist', reload]);
});

// serve & watch
//gulp.task('serve:build', ['copy', 'js', 'serve']);

// ensures js task is completed before reloading
// gulp.task('js-watch', ['js'], done => {
//   browserSync.reload();
//   done();
// });

// Copy unaltered images
gulp.task('unaltered', () => {
  return gulp
    .src('src/img/unaltered/**')
    .pipe(gulp.dest('dist/img/unaltered'))
    .pipe(gulp.dest('.tmp/img/unaltered'));
});

// Builds responsive images
gulp.task('images', ['unaltered'], () => {
  return gulp
    .src('src/img/*.jpg')
    .pipe(
      imagemin({
        progressive: true,
        use: [imageminPngquant()],
        speed: 5
      }).pipe(
        $.responsive(
          {
            '*.jpg': [
              { width: 300, rename: { suffix: '-300' } },
              { width: 400, rename: { suffix: '-400' } },
              { width: 600, rename: { suffix: '-600_2x' } },
              { width: 800, rename: { suffix: '-800_2x' } }
            ]
          },
          {
            quality: 40,
            progressive: true,
            withMetadata: false
          }
        )
      )
    )
    .pipe(gulp.dest('.tmp/img'))
    .pipe(gulp.dest('dist/img'));
});

// gulp.task('images', ['unaltered'], () => {
//   return gulp
//     .src('src/img/*')
//     .pipe(
//       imagemin({
//         progressive: true,
//         use: [imageminPngquant()],
//         speed: 5
//       })
//     )
//     .pipe(gulp.dest('.tmp/img'))
//     .pipe(gulp.dest('dist/img'));
// });

// Prep process of js, css, html files
gulp.task('html', () => {
  return gulp
    .src('src/*.html')
    .pipe($.useref())
    .pipe($.if('*.css', $.autoprefixer()))
    .pipe($.if('*.js', $.babel()))
    .pipe(
      $.if(
        '*.html',
        $.htmlmin({
          removeComments: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: true
        })
      )
    )
    .pipe(gulp.dest('.tmp'));
});

// Scan html for js and css then optimize
gulp.task('html:dist', () => {
  return gulp
    .src('src/*.html')
    .pipe($.size({ title: 'html (before)' }))
    .pipe($.useref({}, lazypipe().pipe($.sourcemaps.init)))
    .pipe($.if('*.css', $.size({ title: 'css (before)' })))
    .pipe(
      $.if(
        '*.css',
        $.csso({
          restructure: false,
          sourceMap: true,
          debug: true
        })
      )
    )
    .pipe($.if('*.css', $.size({ title: 'css (after)' })))
    .pipe($.if('*.css', $.autoprefixer()))
    .pipe($.if('*.js', $.babel()))
    .pipe($.if('*.js', $.size({ title: 'js (before)' })))
    .pipe($.if('*.js', $.uglifyEs.default()))
    .pipe($.if('*.js', $.size({ title: 'js (after)' })))
    .pipe($.sourcemaps.write('.'))
    .pipe(
      $.if(
        '*.html',
        $.htmlmin({
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          minifyJS: { compress: { drop_console: true } },
          removeEmptyAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeOptionalTags: true
        })
      )
    )
    .pipe($.if('*.html', $.size({ title: 'html (after) ', showFiles: false })))
    .pipe(gulp.dest('dist/'));
});

// process sw
gulp.task('sw', () => {
  let bundler = browserify('./src/sw.js', {
    debug: true
  });
  return bundler
    .bundle() // concatenation
    .pipe(source('sw.js'))
    .pipe(buffer())
    .pipe(gulp.dest('.tmp')); // get stream with pathname
});

// optimize sw
gulp.task('sw:dist', () => {
  let bundler = browserify('./src/sw.js', {
    debug: true
  });
  return bundler
    .bundle() // concatenation
    .pipe(source('sw.js')) // get stream with pathname
    .pipe(buffer()) // stream for other plugins
    .pipe(
      $.size({
        title: 'Sw (before) '
      })
    )
    .pipe(
      $.sourcemaps.init({
        loadMaps: true
      })
    )
    .pipe($.uglifyEs.default()) // minify js
    .pipe(
      $.size({
        title: 'Sw (after) '
      })
    )
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

// Copy web manifest
gulp.task('manifest:dist', () => {
  return gulp.src('src/manifest.json').pipe(gulp.dest('.tmp/'));
});

gulp.task('manifest:dist', () => {
  return gulp.src('src/manifest.json').pipe(gulp.dest('dist/'));
});

// Build production files,
gulp.task('default', ['clear:dist'], done => {
  runSequence(
    [
      'start',
      'images',
      'lint',
      'html:dist',
      'sw:dist',
      'manifest:dist',
      'neck'
    ],
    done
  );
});
