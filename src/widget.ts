// Copyright (c) 4thturning
// Distributed under the terms of the Modified BSD License.

import * as widgets from '@jupyter-widgets/base';
// import * as serialize from './serialize';
import { MODULE_NAME, MODULE_VERSION } from './version';

import {
  createChart,
  IChartApi,
  ISeriesApi,
  SeriesType,
  // ISeriesApi,
  // SeriesType,
} from 'lightweight-charts';

// Import the CSS
import '../css/widget.css';

export class ChartModel extends widgets.DOMWidgetModel {
  defaults() {
    return {
      ...widgets.DOMWidgetModel.prototype.defaults(),
      _model_name: ChartModel.model_name,
      _model_module: ChartModel.model_module,
      _model_module_version: ChartModel.model_module_version,
      _view_name: ChartModel.view_name,
      _view_module: ChartModel.view_module,
      _view_module_version: ChartModel.view_module_version,

      series: [],
    };
  }

  static serializers: widgets.ISerializers = {
    ...widgets.DOMWidgetModel.serializers,
    // Add any extra serializers here
    series: { deserialize: widgets.unpack_models },
  };

  static model_name = 'ChartModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'ChartView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class ChartView extends widgets.DOMWidgetView {
  private container: HTMLElement;
  private chart: IChartApi;
  series_views: widgets.ViewList<widgets.DOMWidgetView>;

  render() {
    this.container = document.createElement('div');
    this.container.setAttribute('id', 'chart-container');
    this.el.appendChild(this.container);

    this.chart = createChart(this.container, this.model.get('options'));
    this.series_views = new widgets.ViewList(this.add_series, null, this);

    this.series_views
      .update(this.model.get('series'))
      .then(() => this.chart.timeScale().fitContent());

    this.options_changed();
    this.model.on('change:options', this.options_changed, this);
    this.model.on('change:series', this.series_changed, this);
  }

  options_changed() {
    this.chart.applyOptions(this.model.get('options'));
    this.chart.timeScale().fitContent();
  }
  series_changed(callback, context) {
    alert(callback);
  }

  async add_series(model: SeriesModel) {
    // Called when an series is added to the series list.
    const view = (await this.create_child_view(model)) as SeriesView;
    let series;
    switch (model.get('type')) {
      case 'area':
        series = this.chart.addAreaSeries(model.get('options'));
        break;
      case 'baseline':
        series = this.chart.addBaselineSeries(model.get('options'));
        break;
      case 'bar':
        series = this.chart.addBarSeries(model.get('options'));
        break;
      case 'candlestick':
        series = this.chart.addCandlestickSeries(model.get('options'));
        break;
      case 'histogram':
        series = this.chart.addHistogramSeries(model.get('options'));
        break;
      default:
        series = this.chart.addLineSeries(model.get('options'));
        break;
    }
    series.setData(model.get('data'));
    view.series = series;
    return view;
  }
}

export class SeriesModel extends widgets.DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SeriesModel.model_name,
      _model_module: SeriesModel.model_module,
      _model_module_version: SeriesModel.model_module_version,
      _view_name: SeriesModel.view_name,
      _view_module: SeriesModel.view_module,
      _view_module_version: SeriesModel.view_module_version,
    };
  }

  static serializers: widgets.ISerializers = {
    ...widgets.DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'SeriesModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SeriesView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SeriesView extends widgets.DOMWidgetView {
  series: ISeriesApi<SeriesType>;

  render() {
    this.model.on('change:options', this.options_changed, this);
    this.model.on('change:data', this.data_changed, this);
    this.model.on('change:markers', this.markers_changed, this);
  }

  options_changed() {
    this.series.applyOptions(this.model.get('options'));
  }

  data_changed() {
    this.series.setData(this.model.get('data'));
  }

  markers_changed() {
    this.series.setMarkers(this.model.get('markers'));
  }
}
