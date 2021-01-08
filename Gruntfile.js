const path = require('path');

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
			options: {
				sourceMap: true
			},
			dist: {
				src: ['dist/js/**/*.js'],
				dest: 'dist/js/<%= pkg.name %>.js'
			}
		},

		webpack: {
			myConfig: {
				mode: 'production',
				entry: path.resolve(__dirname, 'dist/js/<%= pkg.name %>.js'),
				output: {
					path: path.resolve(__dirname, 'dist/release'),
					filename: '<%= pkg.name %>.js',
				}
			}
		},

		uglify: {
			options: {
				// sourceMap: true,
				// sourceMapIncludeSources: true,
				// sourceMapIn: function (path) { return path + ".map" },
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %>\n<%= pkg.description %> */\n',
				mangle: {
					toplevel: true
				}
			},
			dist: {
				files: {
					'dist/release/<%= pkg.name %>.min.js': ['dist/release/<%= pkg.name %>.js']
				}
			}
		},

		sass: {
			dist: {
				files: {
					'dist/release/<%= pkg.name %>.css': 'src/styles/main.scss'
				}
			}
		},

		focus: {
			scripts: {
				include: ['scripts']
			},
			styles: {
				include: ['styles']
			}
		},

		watch: {
			scripts: {
				files: ['<%= tslint.files %>'],
				tasks: ['ts', 'concat', 'webpack']
			},
			styles: {
				files: ['src/styles/**/*.scss'],
				tasks: ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-focus');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['tslint', 'ts', 'concat', 'webpack', 'uglify', 'sass']);
	grunt.registerTask('build', ['default']);
	grunt.registerTask('watch:scripts', ['focus:scripts']);
	grunt.registerTask('watch:styles', ['focus:styles']);
};