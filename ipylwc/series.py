from ipywidgets import Widget, widget_serialization, register
from traittypes import DataFrame
from traitlets import Unicode, Enum, Dict, List, Instance

from ._frontend import module_name
from ._version import __version__
from .priceline import PriceLine
from .traits import dataframe_serialization, dataframe_warn_indexname

semver_range_frontend = "~" + __version__

@register
class Series(Widget):
    _model_name = Unicode('SeriesModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(semver_range_frontend).tag(sync=True)
    _view_name = Unicode('SeriesView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(semver_range_frontend).tag(sync=True)

    data = DataFrame(None, allow_none=True) \
        .tag(sync=True, **dataframe_serialization) \
        .valid(dataframe_warn_indexname)

    markers = DataFrame(None, allow_none=True) \
        .tag(sync=True, **dataframe_serialization) \
        .valid(dataframe_warn_indexname)

    options = Dict({}).tag(sync=True)

    type = Enum(['line', 'area', 'histogram', 'bar', 'baseline', 'candlestick'], default_value='line').tag(sync=True)

    pricelines = List(Instance(PriceLine)).tag(sync=True, **widget_serialization)

    def _compare(self, a, b):
        # Compare dataframes properly
        import pandas as pd
        if isinstance(a, pd.DataFrame) or isinstance(b, pd.DataFrame):
            return pd.DataFrame.equals(a, b)

        return super(Series, self)._compare(a, b)

    def add_priceline(self, priceline: PriceLine):
        self.pricelines = [*self.pricelines] + [priceline]
        return priceline

    def remove_priceline(self, priceline: PriceLine):
        self.pricelines = [*filter(lambda x: x != priceline, self.pricelines)]


class LineSeries(Series):
    def __init__(self, **kwargs):
        super(LineSeries, self).__init__(**kwargs)
        self.type = 'line'


class AreaSeries(Series):
    def __init__(self, **kwargs):
        super(AreaSeries, self).__init__(**kwargs)
        self.type = 'area'


class BarSeries(Series):
    def __init__(self, **kwargs):
        super(BarSeries, self).__init__(**kwargs)
        self.type = 'bar'


class BaselineSeries(Series):
    def __init__(self, **kwargs):
        super(BaselineSeries, self).__init__(**kwargs)
        self.type = 'baseline'


class HistogramSeries(Series):
    def __init__(self, **kwargs):
        super(HistogramSeries, self).__init__(**kwargs)
        self.type = 'histogram'


class CandlestickSeries(Series):
    def __init__(self, **kwargs):
        super(CandlestickSeries, self).__init__(**kwargs)
        self.type = 'candlestick'
