const { src, dest, task, series, watch, parallel } = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');

const reload = browserSync.reload;
sass.compiler = require('node-sass');

task('clean', () => {
    return src('dist/**/*', { read: false }).pipe( rm() );
});

task('copy:html', () => {
  return src('src/*.html')
      .pipe(dest('dist'))
      .pipe(reload({ stream: true }));
});

task('copy:favicon', () => {
    return src('src/favicon.ico')
        .pipe(dest('dist'))
        .pipe(reload({ stream: true }));
});

task('copy:assets', () => {
    return src('src/assets/**/*.*')
        .pipe(dest('dist/assets'))
        .pipe(reload({ stream: true }));
});

task('copy:images', () => {
    return src('src/images/content/**/*.*')
        .pipe(dest('dist/images/content'))
        .pipe(reload({ stream: true }));
});

const styles = [
    /*'node_modules/normalize.css/normalize.css',*/
    'src/styles/main.scss'
];

task('styles', () => {
    return src(styles)
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.scss'))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        //.pipe(px2rem())
        .pipe(autoprefixer({
            cascade: false
        }))
        //.pipe(gcmq())
        //.pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(reload({stream: true}));
});

task("scripts", () => {
    return src('./src/scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js', { newLine: ";" }))
        .pipe(babel({
                presets: ['@babel/env']
            })
        )
        //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(reload({stream: true}))
});

task("icons", () => {
    return src("src/images/icons/*.svg")
        .pipe(svgo({
            plugins: [
                {
                    removeAttrs: {
                        attrs: "(fill|stroke|style|width|height|data.*)"
                    }
                }
            ]
        }))
        .pipe(svgSprite({
            mode: {
                dest: '.',
                symbol: {
                    dest: '.',
                    sprite: '../icons/sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/images/icons'))
});

task('server', () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    });
});

watch('./src/styles/**/*.scss', series("styles"));
watch('./src/scripts/*.js', series("scripts"));
watch('./src/*.html', series("copy:html"));
watch('./src/images/content/**/*.*', series("copy:images"));
watch('./src/images/icons/*.svg', series("icons"));

task("default", series('clean', parallel('copy:favicon', 'copy:html', 'copy:images', 'copy:assets', 'icons', 'styles', 'scripts'), 'server'));