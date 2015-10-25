module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        compress: {
            main: {
                options: {
                    archive: "hirse.luacheck.zip"
                },
                files: [
                    {
                        src: [
                            "node/*",
                            "CHANGELOG.md",
                            "LICENSE",
                            "main.js",
                            "package.json",
                            "README.md"
                        ]
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-compress");

    grunt.registerTask("default", [
        "compress"
    ]);
};
