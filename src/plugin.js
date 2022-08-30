"use strict";
// Copyright (c) 4thturning
// Distributed under the terms of the Modified BSD License.
exports.__esModule = true;
var base_1 = require("@jupyter-widgets/base");
var widgetExports = require("./widget");
var version_1 = require("./version");
var EXTENSION_ID = 'pylwc:plugin';
/**
 * The chart plugin.
 */
var chartPlugin = {
    id: EXTENSION_ID,
    requires: [base_1.IJupyterWidgetRegistry],
    activate: activateWidgetExtension,
    autoStart: true
};
// the "as unknown as ..." typecast above is solely to support JupyterLab 1
// and 2 in the same codebase and should be removed when we migrate to Lumino.
exports["default"] = chartPlugin;
/**
 * Activate the widget extension.
 */
function activateWidgetExtension(app, registry) {
    registry.registerWidget({
        name: version_1.MODULE_NAME,
        version: version_1.MODULE_VERSION,
        exports: widgetExports
    });
}
