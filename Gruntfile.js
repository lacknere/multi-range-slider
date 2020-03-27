module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        tslint: {
            options: {
                configuration: 'tslint.json',
                project: 'tsconfig.json'
            },
            files: ['src/**/*.ts']
        },

        ts: {
            default: {
                tsconfig: 'tsconfig.json'
            }
        },

        concat: {
            dist: {
                src: ['dist/js/**/*.js'],
                dest: 'dist/release/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %>\n<%= pkg.description %> */\n',
                mangle: {
                    toplevel: true
                }
            },
            dist: {
                files: {
                    'dist/release/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        focus: {
            scripts: {
                include: ['scripts']
            }
        },

        watch: {
            scripts: {
                files: ['<%= tslint.files %>'],
                tasks: ['ts', 'concat'],
            },
        }
    });

    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-focus');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['tslint', 'ts', 'concat', 'uglify']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('watch:scripts', ['focus:scripts']);
};