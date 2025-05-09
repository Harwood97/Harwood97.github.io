module.exports = function (grunt) {
    const mozjpeg = require('imagemin-mozjpeg');
    const pngquant = require('imagemin-pngquant');
    const sass = require('sass');
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        copy: {
            bootstrap: {
                files: [
                    { //bootstrap scss
                        expand: true,
                        cwd: 'node_modules/bootstrap/scss/',
                        src: ['**'],
                        dest: 'src/vendor/bootstrap/scss/',
                    },
                    { //bootstrap js
                        expand: true,
                        cwd: 'node_modules/bootstrap/dist/js/',
                        src: ['bootstrap.bundle.js'],
                        dest: 'src/vendor/bootstrap/js/',
                    },
                    { //jquery
                        expand: true,
                        cwd: 'node_modules/jquery/dist/',
                        src: ['jquery.js'],
                        dest: 'src/vendor/jquery/',
                    }
                ],
            },
            fontawesome: {
                files: [
                    { //fontawesome scss
                        expand: true,
                        cwd: 'node_modules/@fortawesome/fontawesome-pro/scss/',
                        src: '**',
                        dest: 'src/vendor/fontawesome/scss',
                    },
                    { //fontawesome webfonts
                        expand: true,
                        cwd: 'node_modules/@fortawesome/fontawesome-pro/webfonts/',
                        src: '**',
                        dest: 'dist/webfonts',
                    }
                ],
            },
        },

        /*JS*/
        babel: {
            options: {
                sourceMap: true
            },
            dist1: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: ['*.js'],
                    dest: 'src/js/babel',
                    ext: '.js',
                }]
            },
            dist2: {
                files: [{
                    expand: true,
                    cwd: 'src/js/custom',
                    src: ['*.js'],
                    dest: 'src/js/babel/custom',
                    ext: '.js',
                }]
            }
        },

        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [
                    'node_modules/regenerator-runtime/runtime.js',
                    'src/vendor/jquery/*.js',
                    'src/vendor/bootstrap/js/*.js',
                    'src/js/babel/*.js'
                ],
                // the location of the resulting JS file
                dest: 'src/js/bundled/main.js'
            }
        },

        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist1: {
                files: {
                    'dist/js/main.min.js': ['<%= concat.dist.dest %>']
                }
            },
            dist2: {
                files: [{
                    expand: true,
                    cwd: 'src/js/babel/custom',
                    src: ['*.js'],
                    dest: 'dist/js',
                    ext: '.min.js',
                }]
            }
        },

        /*CSS*/
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            dist: {
                files: {
                    'src/scss/theme.css': 'src/scss/theme.scss'
                }
            }
        },

        postcss: {
            options: {
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    annotation: 'dist/css/maps/' // ...to the specified directory
                },

                processors: [
                    require('autoprefixer')(), // add vendor prefixes
                    require('postcss-font-magician')({display: 'swap'}), // add font-family properties automatically
                    require('cssnano')() // minify the result
                ]
            },
            dist: {
                src: 'src/scss/theme.css',
                dest: 'dist/css/theme.min.css'
            },
        },

        /*IMAGE */
        imagemin: {
            options: {
                use: [
                    pngquant({quality: [1, 1]}),
                    mozjpeg({quality: 85})
                ]
            },
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img',
                    src: ['**/*.{png,jpg,JPG}'],
                    dest: 'dist/img/'
                }]
            }
        },

        cwebp: {
            dynamic: {
                options: {
                    q: 50
                },
                files: [{
                    expand: true,
                    cwd: 'src/img',
                    src: ['**/*.{png,jpg}'],
                    dest: 'dist/img/',
                    ext: '.webp'
                }]
            }
        },

        watch: {
            css: {
                files: ['src/scss/**/*.scss'],
                tasks: ['css']
            },
            jsMain: {
                files: ['src/js/*.js'],
                tasks: ['js']
            },
            jsSingle: {
                files: ['src/js/custom/*.js'],
                tasks: ['jsSingle']
            },
            img: {
                files: ['src/img/*'],
                tasks: ['img']
            }
        }

    });

    /*install steps*/
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('copy-assets', ['copy']);
    /*to watch files for changes*/
    grunt.loadNpmTasks('grunt-contrib-watch');
    /*css tasks*/
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('css', ['sass', 'postcss']);
    /*js tasks*/
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-babel');
    grunt.registerTask('js', ['babel:dist1', 'concat', 'uglify:dist1']);
    grunt.registerTask('jsSingle', ['babel:dist2', 'uglify:dist2']);
    /*image tasks*/
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-cwebp');
    grunt.registerTask('img', ['imagemin', 'cwebp']);

    grunt.registerTask('build', ['copy-assets', 'css', 'js', 'jsSingle', 'img']);

};
