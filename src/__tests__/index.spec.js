"use strict";
// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
exports.__esModule = true;
// Add any needed widget imports here (or from controls)
// import {} from '@jupyter-widgets/base';
var utils_1 = require("./utils");
var __1 = require("..");
describe('Chart', function () {
    describe('ChartModel', function () {
        it('should be createable', function () {
            var model = utils_1.createTestModel(__1.ChartModel);
            expect(model).toBeInstanceOf(__1.ChartModel);
            expect(model.get('value')).toEqual('Hello World');
        });
        it('should be createable with a value', function () {
            var state = { value: 'Foo Bar!' };
            var model = utils_1.createTestModel(__1.ChartModel, state);
            expect(model).toBeInstanceOf(__1.ChartModel);
            expect(model.get('value')).toEqual('Foo Bar!');
        });
    });
});
