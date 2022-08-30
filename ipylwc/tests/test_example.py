#!/usr/bin/env python
# coding: utf-8

# Copyright (c) 4thturning.
# Distributed under the terms of the Modified BSD License.

import pytest

from ..chart import Chart


def test_example_creation_blank():
    w = Chart()
    assert w.value == 'Hello World'
