module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**
         * Watch files for changes
         */
        watch: {
            sass: {
                files: ['asset.src/scss/**/*.{scss,sass}'],
                tasks: ['sass:dist']
            },
            scripts: {
                files: ['asset.src/js/**/*.js'],
                tasks: ['concat']
            },
            html: {
                files: ['asset.src/**/*.html'],
                tasks: ['copy:html']
            }
        },

        /**
         * Compile SASS
         */
        sass: {
            dist: {
                options: {
                    includePaths: [
                        'bower_components/compass-mixins/lib',
                        'bower_components/bourbon/app/assets/stylesheets',
                        'bower_components/foundation/scss'
                    ],
                    outputStyle: 'compressed' // 'nested', 'expanded', 'compact', 'compressed'
                },
                files: {
                    'asset.dist/css/app.css': 'asset.src/scss/app.scss'
                }
            }
        },

        /**
         * Minify CSS.
         */
        cssmin: {
            minify: {
                expand: true,
                cwd: 'asset.dist/css/',
                src: ['**/*.css'],
                dest: 'asset.dist/css/'
            }
        },

        // /**
        //  * Copy files
        //  */
        copy: {
            html: {
                files: [
                    {
                        expand: true,
                        cwd: 'asset.src',
                        src: ['*.html'],
                        dest: 'asset.dist/'
                    }
                ]
            },
            app_fonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'asset.src/fonts',
                        src: ['**/*.*'],
                        dest: 'asset.dist/fonts/'
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'asset.src/img',
                        src: ['**/*.*'],
                        dest: 'asset.dist/img/'
                    }
                ]
            }
        },


        /**
         * Concat
         */
        concat: {
            options: {
                separator: '',
            },
            modernizr: {
                src: ['bower_components/modernizr/modernizr.js'],
                dest: 'asset.dist/js/modernizr.js'
            },
            libs: {
                src: ['bower_components/jquery/dist/jquery.js', 'bower_components/swiper/dist/idangerous.swiper.js', 'asset.src/js/froogaloop.js', 'bower_components/jquery-easing/jquery.easing.js', 'asset.src/js/tappy.js', 'bower_components/eventEmitter/EventEmitter.js', 'bower_components/eventie/eventie.js', 'bower_components/imagesloaded/imagesloaded.js'],
                dest: 'asset.dist/js/libs.js'
            },
            functions: {
                src: ['asset.src/js/functions.js'],
                dest: 'asset.dist/js/functions.js'
            },
            js: {
                src: ['asset.src/js/**/*.js'],
                dest: 'asset.dist/js/scripts.js'
            }
        },

        /**
         * Minify HTML.
         */
        // htmlmin: {
        //     dist: {
        //         options: {
        //             removeComments: true,
        //             collapseWhitespace: true
        //         },
        //         files: [
        //             {
        //                 expand: true,
        //                 cwd: 'asset.dist/',
        //                 src: ['*.html'],
        //                 dest: 'asset.dist/'
        //             }
        //         ]
        //     }
        // },

        /**
         * Uglify.
         */
        uglify: {
            options: {mangle: false},
            libs: {
                files: [
                    {'asset.dist/js/modernizr.js': ['asset.dist/js/modernizr.js']},
                    {'asset.dist/js/libs.js': ['asset.dist/js/libs.js']},
                    {'asset.dist/js/scripts.js': ['asset.dist/js/scripts.js']}
                ]
            }
        },

        includereplace: {
            dist: {
                options: {
                    globals: {
                        timestamp: new Date().getTime(),
                    },
                },
                src: 'asset.dist/index.html',
                dest: 'asset.dist/index.html'
            }
        }

    });

    // Tell Grunt what plugins to use
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-include-replace');

    // Image optimization
    // Tell Grunt which tasks to run on cl 'grunt'
    grunt.registerTask('default', ['sass', 'concat', 'copy', 'cssmin', 'uglify', 'includereplace']);

};
