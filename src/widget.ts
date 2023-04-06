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
  IPriceLine,
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
  // series_views: widgets.ViewList<widgets.WidgetView>;

  render() {
    console.log('rendering ChartView');
    this.container = document.createElement('div');
    this.container.setAttribute('id', 'chart-container');
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
    this.el.appendChild(this.container);
    this.chart = createChart(this.container, this.model.get('options'));

    this.series_changed();
    this.options_changed();
    this.model.on('change:options', this.options_changed, this);
    this.model.on('change:series', this.series_changed, this);
    this.model.on('change:visibleRange', this.visibleRange_changed, this);

    this.chart.timeScale().fitContent();
  }

  options_changed() {
    this.chart.applyOptions(this.model.get('options'));
  }

  visibleRange_changed() {
    this.chart.timeScale().setVisibleRange(this.model.get('visibleRange'));
  }

  series_changed() {
    const old_cids = new Array<string>();
    const new_cids = new Array<string>();

    const prev_series = this.model.previous('series');
    const new_series = this.model.get('series');
    console.log('series_changed', prev_series, new_series);

    if (prev_series !== undefined) {
      prev_series.forEach((e) => old_cids.push(e.cid));
    }
    if (new_series !== undefined) {
      new_series.forEach((e) => new_cids.push(e.cid));
    }

    const diff_to_remove = old_cids.filter((x) => !new_cids.includes(x));
    const diff_to_add = new_cids.filter((x) => !old_cids.includes(x));

    if (prev_series !== undefined) {
      prev_series
        .filter((x) => diff_to_remove.includes(x.cid))
        .forEach((x) =>
          x.forEachView((x) => this.chart.removeSeries(x.series))
        );
    }
    if (new_series !== undefined) {
      new_series
        .filter((x) => diff_to_add.includes(x.cid))
        .forEach((x) => this.addSeries(x));
    }

    this.chart.timeScale().fitContent();
  }

  async addSeries(model: SeriesModel) {
    // Called when a series is added to the series list.
    console.log('creating actual series', model.get('options'));
    const view = await this.create_child_view<SeriesView>(model);
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
    view.series = series;
    view.chart = this.chart;
    return view;
  }
}

export class SeriesModel extends widgets.WidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: SeriesModel.model_name,
      _model_module: SeriesModel.model_module,
      _model_module_version: SeriesModel.model_module_version,
      _view_name: SeriesModel.view_name,
      _view_module: SeriesModel.view_module,
      _view_module_version: SeriesModel.view_module_version,
      pricelines: [],
    };
  }

  static serializers: widgets.ISerializers = {
    ...widgets.DOMWidgetModel.serializers,
    // Add any extra serializers here
    pricelines: { deserialize: widgets.unpack_models },
  };

  public forEachView(callback: (view: SeriesView) => void) {
    for (const view_id in this.views) {
      this.views[view_id].then((view: SeriesView) => {
        callback(view);
      });
    }
  }
  static model_name = 'SeriesModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'SeriesView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class SeriesView extends widgets.WidgetView {
  series: ISeriesApi<SeriesType>;
  chart: IChartApi;

  render() {
    console.log('rendering SeriesView', this.model.cid);

    this.options_changed();
    this.data_changed();
    this.markers_changed();
    this.pricelines_changed();

    this.model.on('change:options', this.options_changed, this);
    this.model.on('change:data', this.data_changed, this);
    this.model.on('change:markers', this.markers_changed, this);
    this.model.on('change:pricelines', this.pricelines_changed, this);
  }

  options_changed() {
    if (this.model.get('options') !== undefined && this.series !== undefined) {
      const model_options = this.model.get('options');

      // convert to a function the value from python autoscaleInfoProvider
      // to js function that has the value received from python, for example
      // autoscaleInfoProvider: () => ({
      // 	priceRange: {
      // 		minValue: 0,
      // 		maxValue: 200,
      // 	},
      // })
      console.log(JSON.stringify(model_options.autoscaleInfoProvider));
      if (model_options.hasOwnProperty('autoscaleInfoProvider')) {
        model_options.autoscaleInfoProvider = new Function('return '+ JSON.stringify(model_options.autoscaleInfoProvider));
      }

      // if (model_options.hasOwnProperty('autoscaleInfoProvider')) {
      //   model_options.autoscaleInfoProvider = () => ({
      //     priceRange: {
      //       minValue: model_options.autoscaleInfoProvider.priceRange.minValue,
      //       maxValue: model_options.autoscaleInfoProvider.priceRange.maxValue,
      //     },
      //   });
      // }
      console.log(model_options);
      this.series.applyOptions(model_options);
      // this.chart.timeScale().fitContent();
    }
  }

  data_changed() {
    if (this.model.get('data') !== undefined && this.series !== undefined) {
      this.series.setData(this.model.get('data'));
      this.chart.timeScale().fitContent();
    }
  }

  markers_changed() {
    if (this.model.get('markers') !== undefined && this.series !== undefined) {
      this.series.setMarkers(this.model.get('markers'));
    }
  }

  pricelines_changed() {
    if (
      this.model.get('pricelines') === undefined ||
      this.series === undefined
    ) {
      return;
    }

    const old_cids = new Array<string>();
    const new_cids = new Array<string>();

    const prev_list = this.model.previous('pricelines');
    const new_list = this.model.get('pricelines');

    if (prev_list !== undefined) {
      prev_list.forEach((e) => old_cids.push(e.cid));
    }
    if (new_list !== undefined) {
      new_list.forEach((e) => new_cids.push(e.cid));
    }

    const diff_to_remove = old_cids.filter((x) => !new_cids.includes(x));
    const diff_to_add = new_cids.filter((x) => !old_cids.includes(x));

    if (prev_list !== undefined) {
      prev_list
        .filter((x) => diff_to_remove.includes(x.cid))
        .forEach((x) =>
          x.forEachView((x) => {
            this.series.removePriceLine(x.priceline);
          })
        );
    }
    if (new_list !== undefined) {
      new_list
        .filter((x) => diff_to_add.includes(x.cid))
        .forEach((x) => this.addPriceLine(x));
    }
  }

  async addPriceLine(model: PriceLineModel) {
    const view = await this.create_child_view<PriceLineView>(model);
    if (this.series !== undefined) {
      const pl = this.series.createPriceLine(model.get('options'));
      view.options = model.get('options');
      view.series = this.series;
      view.priceline = pl;
    }
  }
}

export class PriceLineModel extends widgets.WidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: PriceLineModel.model_name,
      _model_module: PriceLineModel.model_module,
      _model_module_version: PriceLineModel.model_module_version,
      _view_name: PriceLineModel.view_name,
      _view_module: PriceLineModel.view_module,
      _view_module_version: PriceLineModel.view_module_version,
    };
  }

  static serializers: widgets.ISerializers = {
    ...widgets.DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  public forEachView(callback: (view: PriceLineView) => void) {
    for (const view_id in this.views) {
      this.views[view_id].then((view: PriceLineView) => {
        callback(view);
      });
    }
  }
  static model_name = 'PriceLineModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'PriceLineView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class PriceLineView extends widgets.WidgetView {
  priceline: IPriceLine;
  series: ISeriesApi<SeriesType>;

  render() {
    // this.priceline = this.series.createPriceLine(this.model.get('options'));
    this.model.on('change:options', this.options_changed, this);
  }

  options_changed(callback, context) {
    if (this.priceline !== undefined) {
      this.priceline.applyOptions(this.model.get('options'));
    }
  }
}
