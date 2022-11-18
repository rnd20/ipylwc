#!/usr/bin/env python
# coding: utf-8

# Copyright (c) 4thturning.
# Distributed under the terms of the Modified BSD License.

import json
from pathlib import Path

__all__ = ["__version__"]

def __fetchVersion():
    root = Path(__file__).parent.resolve()

    for settings in root.rglob("package.json"):
        try:
            with settings.open() as f:
                return json.load(f)["version"]
        except FileNotFoundError:
            pass

    raise FileNotFoundError(f"Could not find package.json under dir {root!s}")


__version__ = __fetchVersion()
