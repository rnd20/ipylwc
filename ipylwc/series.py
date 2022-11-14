
from ipywidgets import DOMWidget
from traitlets import Unicode, Dict, Enum
from traittypes import DataFrame

from ._frontend import module_name, module_version
from .traits import dataframe_serialization, dataframe_warn_indexname


class Series(DOMWidget):
    _model_name = Unicode('SeriesModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('SeriesView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    data = DataFrame(None, allow_none=True) \
        .tag(sync=True, **dataframe_serialization) \
        .valid(dataframe_warn_indexname)

    markers = DataFrame(None, allow_none=True) \
        .tag(sync=True, **dataframe_serialization) \
        .valid(dataframe_warn_indexname)

    options = Dict({}).tag(sync=True)

    type = Enum(['line', 'area','histogram','bar','baseline','candlestick'], default_value='line').tag(sync=True)

    def _compare(self, a, b):
        # Compare dataframes properly
        import pandas as pd
        if isinstance(a, pd.DataFrame) or isinstance(b, pd.DataFrame):
            return pd.DataFrame.equals(a, b)

        return super(Series, self)._compare(a, b)

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
