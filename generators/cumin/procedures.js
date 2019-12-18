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
 * @fileoverview Generating Cumin for procedure blocks.
 * @author shaty3@hotmail.com (Koichi Nishino)
 */
'use strict';

goog.provide('Blockly.Cumin.procedures');

goog.require('Blockly.Cumin');


Blockly.Cumin['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.Cumin.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var xfix1 = '';
  if (Blockly.Cumin.STATEMENT_PREFIX) {
    xfix1 += Blockly.Cumin.injectId(Blockly.Cumin.STATEMENT_PREFIX,
        block);
  }
  if (Blockly.Cumin.STATEMENT_SUFFIX) {
    xfix1 += Blockly.Cumin.injectId(Blockly.Cumin.STATEMENT_SUFFIX,
        block);
  }
  if (xfix1) {
    xfix1 = Blockly.Cumin.prefixLines(xfix1, Blockly.Cumin.INDENT);
  }
  var loopTrap = '';
  if (Blockly.Cumin.INFINITE_LOOP_TRAP) {
    loopTrap = Blockly.Cumin.prefixLines(
        Blockly.Cumin.injectId(Blockly.Cumin.INFINITE_LOOP_TRAP,
        block), Blockly.Cumin.INDENT);
  }
  var branch = Blockly.Cumin.statementToCode(block, 'STACK');
  var returnValue = Blockly.Cumin.valueToCode(block, 'RETURN',
      Blockly.Cumin.ORDER_NONE) || '';
  var xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Blockly.Cumin.INDENT + 'return ' + returnValue + ';\n';
  }
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.Cumin.variableDB_.getName(block.arguments_[i],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
  code = Blockly.Cumin.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Cumin.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Cumin['procedures_defnoreturn'] =
    Blockly.Cumin['procedures_defreturn'];

Blockly.Cumin['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.Cumin.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.Cumin.valueToCode(block, 'ARG' + i,
        Blockly.Cumin.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Cumin.ORDER_FUNCTION_CALL];
};

Blockly.Cumin['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  var tuple = Blockly.Cumin['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};

Blockly.Cumin['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.Cumin.valueToCode(block, 'CONDITION',
      Blockly.Cumin.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (Blockly.Cumin.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Blockly.Cumin.prefixLines(
        Blockly.Cumin.injectId(Blockly.Cumin.STATEMENT_SUFFIX, block),
        Blockly.Cumin.INDENT);
  }
  if (block.hasReturnValue_) {
    var value = Blockly.Cumin.valueToCode(block, 'VALUE',
        Blockly.Cumin.ORDER_NONE) || 'null';
    code += Blockly.Cumin.INDENT + 'return ' + value + ';\n';
  } else {
    code += Blockly.Cumin.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};
