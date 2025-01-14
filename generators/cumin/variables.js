/**
 * @license
 * Copyright 2012 Google LLC
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
 * @fileoverview Generating Cumin for variable blocks.
 * @author shaty3@hotmail.com (Koichi Nishino)
 */
'use strict';

goog.provide('Blockly.Cumin.variables');

goog.require('Blockly.Cumin');


Blockly.Cumin['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.Cumin.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Cumin.ORDER_ATOMIC];
};

Blockly.Cumin['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Cumin.valueToCode(block, 'VALUE',
      Blockly.Cumin.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Cumin.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};
