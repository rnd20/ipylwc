#!/usr/bin/env python
# coding: utf-8

# Copyright (c) 4thturning.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, widget_serialization, register
from traitlets import Unicode, Dict, List, Instance, observe

from ._frontend import module_name
from .series import Series, LineSeries, AreaSeries
from ._version import __version__
semver_range_frontend = "~" + __version__

@register
class Chart(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('ChartModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(semver_range_frontend).tag(sync=True)
    _view_name = Unicode('ChartView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(semver_range_frontend).tag(sync=True)

    options = Dict({}).tag(sync=True)
    series = List(Instance(Series)).tag(sync=True, **widget_serialization)
    visibleRange = Dict({}).tag(sync=True)

    # @observe('series')
    # def _observe_series(self, change):
    #     print('AA',change['old'])
    #     print('BB',change['new'])
    #

    def add_series(self, series: Series):
        self.series = [*self.series] + [series]
        return series

    def remove_series(self, series: Series):
        self.series = [*filter(lambda x: x != series, self.series)]
