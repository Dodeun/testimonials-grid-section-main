// ┌──────────────────────────────────────────┐
// │         GULPFILE VERSION 08-2021         │
// └──────────────────────────────────────────┘

// Réglages
// ────────
const virtual_host = 'testimonials-grid-section-main.local';


// Délaration dépendances
// ──────────────────────
// -> Installer toutes les dépendances : npm install gulp browser-sync gulp-plumber gulp-notify gulp-sourcemaps gulp-sass sass gulp-postcss autoprefixer cssnano gulp-rename gulp-size gulp-concat gulp-uglify --save-dev
const { src, dest, series, parallel, watch } = require('gulp');
const browsersync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const rename = require('gulp-rename');
const size = require('gulp-size');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const onError = function(err) {
    notify.onError({
        title:    "Gulp error !",
        message:  "Erreur : <%= error.message %>"
    })(err);

    this.emit('end');
};


// Tâches traitement
// ─────────────────


// Traitement CSS
function css() {
    return src('./src/scss/(main).scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(size({title: 'CSS generated : '}))
    .pipe(dest('./dist/css'))
    .pipe(browsersync.stream());
}

// Traitement JS
function js() {
    return src('./src/js/**/*.js')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(concat('site.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(size({title: 'JS generated : '}))
    .pipe(dest('./dist/js'))
    .pipe(browsersync.stream());
}

// Tâches watch/serveur
// ────────────────────

// Watch files
function watchFiles(cb) {
    watch('./src/scss/*.scss', { delay: 30 }, css);
    watch('./src/js/**/*.js', { delay: 30 }, js);
    watch(['**/*.html', '**/*.php'], browserSyncReload);
    cb();
}

// BrowserSync
function browserSync(cb) {
    browsersync.init({
        open: true,
        proxy: virtual_host,
        port: 3000
    });
    cb();
}

// BrowserSync Reload
function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}


// Exports
// ───────
// -> commandes disponibles depuis la console pour lancer des tasks
exports.css = css;
exports.js = js;
exports.watch = watchFiles;
exports.default = series(parallel(css, js), parallel(watchFiles, browserSync));