/* jshint node: true */

(function () {
    "use strict";

    var childProcess = require("child_process");

    /**
     * Runs Luacheck on a file.
     * @param {String}   fullPath Path to the file
     * @param {Function} callback Callback function to return the errors
     */
    function runLuacheck(fullPath, callback) {
        var filename = fullPath.substr(fullPath.lastIndexOf("/") + 1);
        var dirname = fullPath.substr(0, fullPath.lastIndexOf("/"));
        var options = [
            filename,
            "--filename \"\"",
            "--formatter plain",
            "--codes",
            "--no-color"
        ];

        childProcess.exec("luacheck " + options.join(" "), {
            cwd: dirname
        }, function (error, stdout) {
            var errors = [];
            var regex = /^:(\d+):(\d+):( \(([WE])\d+\)) (.+)$/gm;
            var line;
            while ((line = regex.exec(stdout))) {
                errors.push({
                    pos: {
                        line: line[1] - 1,
                        ch: line[2] - 1
                    },
                    message: line[5] + line[3],
                    type: line[4]
                });
            }
            callback(null, errors);
        });
    }

    /**
     * Initializes the luacheck domain with the luacheck command.
     * @param {DomainManager} domainManager The DomainManager for the server
     */
    function init(domainManager) {
        if (!domainManager.hasDomain("luacheck")) {
            domainManager.registerDomain("luacheck", {
                major: 0,
                minor: 1
            });
        }
        domainManager.registerCommand(
            "luacheck",
            "runLuacheck",
            runLuacheck,
            true,
            "Runs Luacheck, and returns an array of errors for the text",
            [{
                name: "fullPath",
                type: "string",
                description: "The path to the file to check with Luacheck"
            }], [{
                name: "errors",
                type: "array",
                description: "List of error objects returned by Luacheck"
            }]
        );
    }

    exports.init = init;
}());
