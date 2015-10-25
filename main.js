define(function (require, exports, module) {
    "use strict";

    /* beautify preserve:start */
    var CodeInspection  = brackets.getModule("language/CodeInspection");
    var LanguageManager = brackets.getModule("language/LanguageManager");
    var ExtensionUtils  = brackets.getModule("utils/ExtensionUtils");
    var NodeDomain      = brackets.getModule("utils/NodeDomain");
    /* beautify preserve:end */

    var luacheckDomain = new NodeDomain("luacheck", ExtensionUtils.getModulePath(module, "node/domain"));

    /**
     * Lint the file asynchronously.
     * @param   {String}     text     Text of the file
     * @param   {String}     fullPath Path to the file
     * @returns {$.Deferred} jQuery promise which will be resolved to the errors.
     */
    function scanFileAsync(text, fullPath) {
        var deferred = new $.Deferred();

        luacheckDomain.exec("runLuacheck", fullPath).done(function (items) {
            var errors = items.map(function (item) {
                return {
                    pos: item.pos,
                    message: item.message,
                    type: item.code === "W" ? CodeInspection.Type.WARNING : CodeInspection.Type.ERROR,
                };
            });

            deferred.resolve({
                errors: errors
            });
        }).fail(function (err) {
            deferred.reject(err);
        });
        return deferred.promise();
    }

    CodeInspection.register("lua", {
        name: "Luacheck",
        scanFileAsync: scanFileAsync
    });

    var Language = LanguageManager.getLanguage("lua");
    if (Language) {
        Language.addFileName(".luacheckrc");

    } else {
        LanguageManager.defineLanguage("lua", {
            name: "Lua",
            mode: "lua",
            fileExtensions: ["lua"],
            fileNames: [".luacheckrc"],
            lineComment: ["--"],
            blockComment: ["--[[", "]]"]
        });
    }
});
