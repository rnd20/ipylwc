"use strict";
// Copyright (c) 4thturning
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.SeriesView = exports.SeriesModel = exports.ChartView = exports.ChartModel = void 0;
var widgets = require("@jupyter-widgets/base");
var serialize = require("./serialize");
var version_1 = require("./version");
var lightweight_charts_1 = require("lightweight-charts");
// Import the CSS
require("../css/widget.css");
var ChartModel = /** @class */ (function (_super) {
    __extends(ChartModel, _super);
    function ChartModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartModel.prototype.defaults = function () {
        return __assign(__assign({}, widgets.DOMWidgetModel.prototype.defaults()), { _model_name: ChartModel.model_name, _model_module: ChartModel.model_module, _model_module_version: ChartModel.model_module_version, _view_name: ChartModel.view_name, _view_module: ChartModel.view_module, _view_module_version: ChartModel.view_module_version, series_list: [] });
    };
    // static serializers = {
    //   ...widgets.DOMWidgetModel.serializers,
    //   // Add any extra serializers here
    //   // series_list: { deserialize: widgets.unpack_models},
    // };
    ChartModel.serializers = __assign(__assign({}, widgets.DOMWidgetModel.serializers), { 
        // Add any extra serializers here
        series_list: { deserialize: serialize.array_or_json_serializer } });
    ChartModel.model_name = 'ChartModel';
    ChartModel.model_module = version_1.MODULE_NAME;
    ChartModel.model_module_version = version_1.MODULE_VERSION;
    ChartModel.view_name = 'ChartView'; // Set to null if no view
    ChartModel.view_module = version_1.MODULE_NAME; // Set to null if no view
    ChartModel.view_module_version = version_1.MODULE_VERSION;
    return ChartModel;
}(widgets.DOMWidgetModel));
exports.ChartModel = ChartModel;
var ChartView = /** @class */ (function (_super) {
    __extends(ChartView, _super);
    function ChartView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartView.prototype.render = function () {
        this.container = document.createElement('div');
        this.container.setAttribute('id', 'chart-container');
        this.el.appendChild(this.container);
        this.chart = lightweight_charts_1.createChart(this.container, this.model.get('options'));
        // alert(JSON.stringify());
        var series_list = this.model.get('series_list');
        alert(series_list[0]);
        // alert(JSON.stringify(series_list[0].data));
        // let obj = JSON.parse(JSON.stringify(series_list));
        // alert(JSON.stringify(obj[0].data));
        // alert(JSON.stringify(series_list));
        // for (const series in obj) {
        //   alert(series);
        //   // const ps = JSON.parse(series);
        //   // alert(JSON.stringify(ps.options));
        //   // const a = this.chart.addLineSeries(series.options);
        //   // a.setData(series.data);
        // }
        this.options_changed();
        this.model.on('change:options', this.options_changed, this);
    };
    ChartView.prototype.options_changed = function () {
        this.chart.applyOptions(this.model.get('options'));
        this.chart.timeScale().fitContent();
    };
    return ChartView;
}(widgets.DOMWidgetView));
exports.ChartView = ChartView;
var SeriesModel = /** @class */ (function (_super) {
    __extends(SeriesModel, _super);
    function SeriesModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SeriesModel.prototype.defaults = function () {
        return __assign(__assign({}, _super.prototype.defaults.call(this)), { _model_name: SeriesModel.model_name, _model_module: SeriesModel.model_module, _model_module_version: SeriesModel.model_module_version, _view_name: SeriesModel.view_name, _view_module: SeriesModel.view_module, _view_module_version: SeriesModel.view_module_version });
    };
    SeriesModel.serializers = __assign({}, widgets.DOMWidgetModel.serializers);
    SeriesModel.model_name = 'SeriesModel';
    SeriesModel.model_module = version_1.MODULE_NAME;
    SeriesModel.model_module_version = version_1.MODULE_VERSION;
    SeriesModel.view_name = 'SeriesView'; // Set to null if no view
    SeriesModel.view_module = version_1.MODULE_NAME; // Set to null if no view
    SeriesModel.view_module_version = version_1.MODULE_VERSION;
    return SeriesModel;
}(widgets.DOMWidgetModel));
exports.SeriesModel = SeriesModel;
var SeriesView = /** @class */ (function (_super) {
    __extends(SeriesView, _super);
    function SeriesView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SeriesView.prototype.render = function () {
        // this.model.on('change:options', this.options_changed, this);
        // this.model.on('change:data', this.data_changed, this);
    };
    SeriesView.prototype.options_changed = function () {
        this.series.applyOptions(this.model.get('options'));
    };
    SeriesView.prototype.data_changed = function () {
        this.series.setData(this.model.get('data'));
    };
    return SeriesView;
}(widgets.DOMWidgetView));
exports.SeriesView = SeriesView;
