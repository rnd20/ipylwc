#!/usr/bin/env python
# coding: utf-8

# Copyright (c) 4thturning.
# Distributed under the terms of the Modified BSD License.

"""
TODO: Add module docstring
"""

from ipywidgets import Widget, register
from traitlets import Unicode, Dict

from ._frontend import module_name
from ._version import __version__
semver_range_frontend = "~" + __version__

@register
class PriceLine(Widget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('PriceLineModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(semver_range_frontend).tag(sync=True)
    _view_name = Unicode('PriceLineView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(semver_range_frontend).tag(sync=True)

    options = Dict({}).tag(sync=True)
