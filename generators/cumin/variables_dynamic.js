/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Cumin for dynamic variable blocks.
 * @author shaty3@hotmail.com (Koichi Nishino)
 */
'use strict';

goog.provide('Blockly.Cumin.variablesDynamic');

goog.require('Blockly.Cumin');
goog.require('Blockly.Cumin.variables');


// Cumin is dynamically typed.
Blockly.Cumin['variables_get_dynamic'] =
    Blockly.Cumin['variables_get'];
Blockly.Cumin['variables_set_dynamic'] =
    Blockly.Cumin['variables_set'];
