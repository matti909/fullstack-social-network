'use strict';

const graphqlTypes = require('..');
const assert = require('assert').strict;

assert.strictEqual(graphqlTypes(), 'Hello from graphqlTypes');
console.info('graphqlTypes tests passed');
