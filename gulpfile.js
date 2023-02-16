import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import csso from 'postcss-csso';
import htmlmin from 'gulp-htmlmin';
import terser from "gulp-terser";
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/main.js')
    .pipe(terser())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// Images

export const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}', {base: 'source/img'})
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src([
    'source/img/**/*.{jpg,png,svg,webp}',
    '!source/img/icons/*.svg'
  ], {base: 'source/img'})
    .pipe(gulp.dest('build/img'))
}

// Webp

const webp = () => {
  return gulp.src([
    'source/img/**/*.{jpg,png}',
    '!source/img/favicons/*',
  ], {base: 'source/img'})
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

export const webpSource = () => {
  return gulp.src([
    'source/img/**/*.{jpg,png}',
    '!source/img/favicons/*',
  ], {base: 'source/img'})
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('source/img'))
}

// SVG

const svg = () => {
  return gulp.src([
    'source/img/**/*.svg',
    '!source/img/icons/*.svg',
  ], {base: 'source/img'})
    .pipe(svgo({
      plugins: [
        {
          removeViewBox: false,
        }
      ]
    }))
    .pipe(gulp.dest('build/img'))
}

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo({
      plugins: [
        {
          removeViewBox: false,
        }
      ]
    }))
    .pipe(svgstore({
      inlineSvg: true,
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/vector'))
}

// Copy files

const copy = () => {
  return gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
  ], {base: 'source'})
    .pipe(gulp.dest('build'))
}

// Clean

const clean = () => {
  return del('build');
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    svg,
    sprite,
    webp,
  ),
  gulp.series(
    server,
    watcher,
  )
)

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    // scripts,
    // sprite,
  ),
  gulp.series(
    server,
    watcher,
  )
);
