#!/usr/bin/env python
# coding: utf-8

# Copyright (c) 4thturning.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import DOMWidget, widget_serialization
from traitlets import Unicode, Dict, List, Instance

from ._frontend import module_name, module_version
from .series import Series


class Chart(DOMWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('ChartModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('ChartView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    options = Dict({}).tag(sync=True)
    series = List(Instance(Series)).tag(sync=True, **widget_serialization)