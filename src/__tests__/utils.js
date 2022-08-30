"use strict";
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.createTestModel = exports.DummyManager = exports.MockComm = void 0;
var widgets = require("@jupyter-widgets/base");
var numComms = 0;
var MockComm = /** @class */ (function () {
    function MockComm() {
        this.target_name = 'dummy';
        this._on_msg = null;
        this._on_close = null;
        this.comm_id = "mock-comm-id-" + numComms;
        numComms += 1;
    }
    MockComm.prototype.on_close = function (fn) {
        this._on_close = fn;
    };
    MockComm.prototype.on_msg = function (fn) {
        this._on_msg = fn;
    };
    MockComm.prototype._process_msg = function (msg) {
        if (this._on_msg) {
            return this._on_msg(msg);
        }
        else {
            return Promise.resolve();
        }
    };
    MockComm.prototype.close = function () {
        if (this._on_close) {
            this._on_close();
        }
        return 'dummy';
    };
    MockComm.prototype.send = function () {
        return 'dummy';
    };
    MockComm.prototype.open = function () {
        return 'dummy';
    };
    return MockComm;
}());
exports.MockComm = MockComm;
var DummyManager = /** @class */ (function (_super) {
    __extends(DummyManager, _super);
    function DummyManager() {
        var _this = _super.call(this) || this;
        _this.testClasses = {};
        _this.el = window.document.createElement('div');
        return _this;
    }
    DummyManager.prototype.display_view = function (msg, view, options) {
        var _this = this;
        // TODO: make this a spy
        // TODO: return an html element
        return Promise.resolve(view).then(function (view) {
            _this.el.appendChild(view.el);
            view.on('remove', function () { return console.log('view removed', view); });
            return view.el;
        });
    };
    DummyManager.prototype.loadClass = function (className, moduleName, moduleVersion) {
        if (moduleName === '@jupyter-widgets/base') {
            if (widgets[className]) {
                return Promise.resolve(widgets[className]);
            }
            else {
                return Promise.reject("Cannot find class " + className);
            }
        }
        else if (moduleName === 'jupyter-datawidgets') {
            if (this.testClasses[className]) {
                return Promise.resolve(this.testClasses[className]);
            }
            else {
                return Promise.reject("Cannot find class " + className);
            }
        }
        else {
            return Promise.reject("Cannot find module " + moduleName);
        }
    };
    DummyManager.prototype._get_comm_info = function () {
        return Promise.resolve({});
    };
    DummyManager.prototype._create_comm = function () {
        return Promise.resolve(new MockComm());
    };
    return DummyManager;
}(widgets.ManagerBase));
exports.DummyManager = DummyManager;
function createTestModel(constructor, attributes) {
    var id = widgets.uuid();
    var widget_manager = new DummyManager();
    var modelOptions = {
        widget_manager: widget_manager,
        model_id: id
    };
    return new constructor(attributes, modelOptions);
}
exports.createTestModel = createTestModel;
