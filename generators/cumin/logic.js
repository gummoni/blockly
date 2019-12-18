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
 * @fileoverview Generating Cumin for logic blocks.
 * @author shaty3@hotmail.com (Koichi Nishino)
 */
'use strict';

goog.provide('Blockly.Cumin.logic');

goog.require('Blockly.Cumin');


Blockly.Cumin['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Blockly.Cumin.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.Cumin.injectId(Blockly.Cumin.STATEMENT_PREFIX,
        block);
  }
  do {
    conditionCode = Blockly.Cumin.valueToCode(block, 'IF' + n,
        Blockly.Cumin.ORDER_NONE) || 'false';
    branchCode = Blockly.Cumin.statementToCode(block, 'DO' + n);
    if (Blockly.Cumin.STATEMENT_SUFFIX) {
      branchCode = Blockly.Cumin.prefixLines(
          Blockly.Cumin.injectId(Blockly.Cumin.STATEMENT_SUFFIX,
          block), Blockly.Cumin.INDENT) + branchCode;
    }
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Blockly.Cumin.STATEMENT_SUFFIX) {
    branchCode = Blockly.Cumin.statementToCode(block, 'ELSE');
    if (Blockly.Cumin.STATEMENT_SUFFIX) {
      branchCode = Blockly.Cumin.prefixLines(
          Blockly.Cumin.injectId(Blockly.Cumin.STATEMENT_SUFFIX,
          block), Blockly.Cumin.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.Cumin['controls_ifelse'] = Blockly.Cumin['controls_if'];

Blockly.Cumin['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Cumin.ORDER_EQUALITY : Blockly.Cumin.ORDER_RELATIONAL;
  var argument0 = Blockly.Cumin.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Cumin.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Cumin['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Cumin.ORDER_LOGICAL_AND :
      Blockly.Cumin.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Cumin.valueToCode(block, 'A', order);
  var argument1 = Blockly.Cumin.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Cumin['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.Cumin.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.Cumin.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.Cumin['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Cumin.ORDER_ATOMIC];
};

Blockly.Cumin['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.Cumin.ORDER_ATOMIC];
};

Blockly.Cumin['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Cumin.valueToCode(block, 'IF',
      Blockly.Cumin.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Cumin.valueToCode(block, 'THEN',
      Blockly.Cumin.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.Cumin.valueToCode(block, 'ELSE',
      Blockly.Cumin.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.Cumin.ORDER_CONDITIONAL];
};
