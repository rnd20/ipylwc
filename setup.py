#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

from __future__ import print_function
from glob import glob
import os
from os.path import join as pjoin
from setuptools import setup, find_packages
import json
from pathlib import Path

import setuptools

from jupyter_packaging import (
    create_cmdclass,
    install_npm,
    ensure_targets,
    combine_commands,
    skip_if_exists
)

HERE = Path(__file__).parent.resolve()


# The name of the project
name = 'ipylwc'

# Get the package info from package.json
pkg_json = json.loads((HERE / "package.json").read_bytes())


# Representative files that should exist after a successful build
jstargets = [
    pjoin(HERE, name, 'nbextension', 'index.js'),
    pjoin(HERE, name, 'labextension', 'package.json'),
]


package_data_spec = {
    name: [
        'nbextension/**js*',
        'labextension/**'
    ]
}


data_files_spec = [
    ('share/jupyter/nbextensions/ipylwc', 'ipylwc/nbextension', '**'),
    ('share/jupyter/labextensions/ipylwc', 'ipylwc/labextension', '**'),
    ('share/jupyter/labextensions/ipylwc', '.', 'install.json'),
    ('etc/jupyter/nbconfig/notebook.d', '.', 'ipylwc.json'),
]


cmdclass = create_cmdclass('jsdeps', package_data_spec=package_data_spec,
    data_files_spec=data_files_spec)
npm_install = combine_commands(
    install_npm(HERE, build_cmd='build:prod'),
    ensure_targets(jstargets),
)
cmdclass['jsdeps'] = skip_if_exists(jstargets, npm_install)


setup_args = dict(
    name            = name,
    description     = pkg_json["description"],
    version         = pkg_json["version"],
    scripts         = glob(pjoin('scripts', '*')),
    cmdclass        = cmdclass,
    packages        = find_packages(),
    author          = '4thturning',
    author_email    = '4thrutning@eath.com',
    url             = 'https://github.com/rnd20/ipylwc',
    license         = 'BSD',
    platforms       = "Linux, Mac OS X, Windows",
    keywords        = ['Jupyter', 'Widgets', 'IPython'],
    extras_require = {
        'test': [
            'pytest>=4.6',
            'pytest-cov',
            'nbval',
        ],
        'examples': [
            # Any requirements for the examples to run
        ],
        'docs': [
            'jupyter_sphinx',
            'nbsphinx',
            'nbsphinx-link',
            'pytest_check_links',
            'pypandoc',
            'recommonmark',
            'sphinx>=1.5',
            'sphinx_rtd_theme',
        ],
    },
    entry_points = {
    },
)

if __name__ == '__main__':
    setup(**setup_args)
