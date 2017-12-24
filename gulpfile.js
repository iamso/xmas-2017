const gulp            = require('gulp');
const gutil           = require("gulp-util");
const babel           = require('gulp-babel');

const webpack         = require('webpack-stream');

const postcss         = require('gulp-postcss');
const postcssApply    = require('postcss-apply');
const postcssImport   = require('postcss-import');
const postcssMixins   = require('postcss-mixins');
const postcssCssnext  = require('postcss-cssnext');
const postcssComments = require('postcss-discard-comments');
const postcssNested   = require('postcss-nested');
const postcssEach     = require('postcss-each');
const postcssGradient = require('postcss-easing-gradients');
const postcssFor      = require('postcss-for');
const postcssCond     = require('postcss-conditionals');
const postcssSimple   = require('postcss-simple-vars');
const postcssProps    = require('postcss-custom-properties');
const postcssReporter = require('postcss-reporter');

const sourcemaps      = require('gulp-sourcemaps');
const cssnano         = require('gulp-cssnano');
const rename          = require('gulp-rename');
const eslint          = require('gulp-eslint');
const banner          = require('gulp-banner');
const manifest        = require('gulp-manifest');
const modernizr       = require('gulp-modernizr');
const imagemin        = require('gulp-imagemin');
const htmlmin         = require('gulp-htmlmin');
const notify          = require('gulp-notify');
const iconfont        = require('gulp-iconfont');
const consolidate     = require('gulp-consolidate');
const replace         = require('gulp-replace');

const pkg             = require('./package.json');

const browserSync     = require('browser-sync').create();
const reload          = browserSync.reload;

const comment         = `/*!
 * ${pkg.name}
 *
 * Made with ❤ by ${pkg.author}
 *
 * Copyright (c) ${(new Date()).getFullYear()} ${pkg.copyright}
 */
`;

const src             = {
  cssAll:       'assets/css/_src/**/*.css',
  cssMain:      'assets/css/_src/main.css',
  cssDest:      'assets/css',
  jsAll:        'assets/js/_src/**/*.js',
  jsMain:       'assets/js/_src/main.js',
  jsDest:       'assets/js',
  iconsAll:     'assets/icons/*.svg',
  iconsCss:     'assets/icons/_template/_icons.css',
  iconsCssDest: 'assets/css/_src/partials/modules/',
  iconsDest:    'assets/fonts',
};

const babelMinify = [
  'minify',
  {
    mangle: {
      exclude: ['jQuery', '$']
    },
    deadcode: true,
    removeConsole: true,
    removeDebugger: true,
    removeUndefined: true,
  }
];

const prefixConfig    = {
  diff: true,
  map: false,
  remove: false,
};

const eslintConfig    = require('./.config/eslint.config');
const webpackConfig   = require('./.config/webpack.config');

gulp.task('watch', () => {
  browserSync.init(['**/*.html', '**/*.php'], {
    proxy: 'xmas-2017.local',
    port: 3000,
    open: true,
    notify: false,
  });

  gulp.watch(src.cssAll, ['css']);
  gulp.watch(src.jsAll, ['js']);
  gulp.watch(src.iconsAll, ['iconfont']);
});

gulp.task('css', (done) => {
  return gulp.src(src.cssMain)
    // .pipe(sourcemaps.init())
    .pipe(postcss([
      postcssImport,
      postcssMixins,
      postcssProps,
      postcssFor,
      postcssEach,
      postcssSimple,
      postcssCond,
      postcssGradient,
      postcssApply,
      postcssCssnext(prefixConfig),
      postcssNested,
      postcssComments({removeAll: true}),
      postcssReporter({ clearMessages: true }),
    ]))
    .on('error', done)
    // .pipe(sourcemaps.write())
    .pipe(rename('bundle.css'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.cssDest))
    .pipe(cssnano({
      discardComments: {
        removeAll: true
      },
      zindex:  false,
    }))
    .pipe(rename('bundle.min.css'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.cssDest))
    .pipe(reload({stream: true}))
    .pipe(notify('css done'));
});

gulp.task('js', ['eslint', 'fallback'], () => {
  return gulp.src(src.jsMain)
    // .pipe(webpack(webpackConfig)).on('error', onError)
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(rename('bundle.js'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.jsDest))
    .pipe(replace(/window\.app\s\=.*/, ''))
    .pipe(babel({
      presets: [babelMinify]
    }))
    .pipe(rename('bundle.min.js'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.jsDest))
    .pipe(reload({stream: true}))
    .pipe(notify('js done'));
});

gulp.task('eslint', () => {
  return gulp.src(src.jsAll)
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format());
});

gulp.task('fallback', () =>  {
  return gulp.src('assets/js/_src/fallback.js')
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.jsDest))
    .pipe(babel({
      presets: [babelMinify]
    }))
    .pipe(rename('fallback.min.js'))
    .pipe(banner(comment))
    .pipe(gulp.dest(src.jsDest));
});

gulp.task('vendor', () => {
  return gulp.src([
      // 'node_modules/jquery/dist/jquery*',
      'node_modules/promise-polyfill/promise.*',
      // 'node_modules/objectFitPolyfill/dist/*',
      // 'node_modules/intersection-observer/intersection-observer.js',
      'node_modules/object.assign-polyfill/object.assign.js',
    ])
    .pipe(gulp.dest('assets/js/vendor'));
});

gulp.task('modernizr', () => {
  return gulp.src([`${src.cssDest}/*.css`, `${src.jsDest}/*.js`])
    .pipe(modernizr({
      "cache": false,
      "extra" : {
        "shiv" : true,
        "printshiv" : true,
        "load" : true,
        "mq" : true,
        "cssclasses" : true
      },
      "options" : [
        "setClasses",
        "addTest",
        "html5printshiv",
        "testProp",
        "fnBind",
        "mq"
      ],
      "excludeTests": [
        "hidden"
      ],
      "parseFiles" : true,
      "crawl" : true,
      "uglify" : true,
      "matchCommunityTests" : true,
    }))
    .pipe(babel({
      presets: [babelMinify]
    }))
    .pipe(gulp.dest(`${src.jsDest}/vendor`));
});

gulp.task('manifest', () => {
  return gulp.src(['./**/*.*'])
    .pipe(manifest({
      hash: true,
      preferOnline: false,
      network: ['*'],
      filename: 'manifest.appcache',
      exclude: [
        '*.appcache',
        '*.lock',
        '**/*.json',
        '**/_src/**/*.*',
        'assets/icons/**/*.*',
        'webpack.config.js',
        'gulpfile.js',
        'bower_components/**/*.*',
        'node_modules/**/*.*',
      ]
     }))
    .pipe(gulp.dest('./'));
});

gulp.task('imagemin', () => {
  return gulp.src('assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img'));
});

gulp.task('htmlmin', ['public'], () => {
  return gulp.src('*.html')
    .pipe(htmlmin())
    .pipe(gulp.dest('./public'));
});

gulp.task('public', () => {
  return gulp.src([
      '**/.htaccess',
      '*.png',
      '*.ico',
      '*.txt',
      '*.appcache',
      'assets/**/*.*',
      '!assets/**/_src/*',
    ])
    .pipe(gulp.dest('./public'));
});

gulp.task('iconfont', () => {
  gulp.src(src.iconsAll)
    .pipe(iconfont({
      fontName: 'icons',
      prependUnicode: false,
      formats: ['woff2', 'woff', 'svg'],
      normalize: true,
      centerHorizontally: true,
      fontHeight: 1000 // IMPORTANT
    }))
    .on('glyphs', (glyphs, options) => {
      glyphs = glyphs.map((glyph) => {
        glyph.codepoint = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase();
        return glyph;
      });
      gulp.src(src.iconsCss)
        .pipe(consolidate('lodash', Object.assign({}, options, {
          timestamp: Math.round(+new Date()/1000),
          param: true,
          cssPrefix: 'icon-',
          fontPath: '../fonts/',
        })))
        .pipe(rename('_icons.css'))
        .pipe(gulp.dest(src.iconsCssDest));
    })
    .pipe(gulp.dest(src.iconsDest));
});

gulp.task('default', ['dist', 'watch']);

gulp.task('dev', ['css', 'js', 'fallback', 'watch']);

gulp.task('dist', ['css', 'js', 'fallback', 'vendor'], () => {
  return gulp.src('./')
    .pipe(notify('dist done'));
});

// generic error handler
function onError(err) {
  gutil.log(err.message);
  this.emit('end');
}
