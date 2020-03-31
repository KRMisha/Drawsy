// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// zone.js must be imported before the other imports
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing'; // tslint:disable-line: ordered-imports
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

declare const require: {
    context(path: string, deep?: boolean, filter?: RegExp): { keys(): string[]; <T>(id: string): T };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
