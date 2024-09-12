/**
 * @fileoverview Explicitly list variables, objects or method whose names should not be mangled by the closer-compiler.
 *
 * @externs
 */

/**
 * @type {{level1: Array<{index: string, correctPositions: Object<string, string>}>, 
*         level2: Array<{index: string, correctPositions: Object<string, string>}>, 
*         level3: Array<{index: string, correctPositions: Object<string, string}>},
*         level4: Array<{index: string, correctPositions: Object<string, string}>},
*         level5: Array<{index: string, correctPositions: Object<string, string}>},
*         level6: Array<{index: string, correctPositions: Object<string, string}>},
*         level7: Array<{index: string, correctPositions: Object<string, string}>},
*         level8: Array<{index: string, correctPositions: Object<string, string}>},
*         level9: Array<{index: string, correctPositions: Object<string, string}>},
*         level10: Array<{index: string, correctPositions: Object<string, string}>},
*         level11: Array<{index: string, correctPositions: Object<string, string}>},
*         level12: Array<{index: string, correctPositions: Object<string, string}>},
*         level13: Array<{index: string, correctPositions: Object<string, string}>}
*        }}
*/
gameDataArray

/** @type {{a1: string, a2: string, a3: string, a4: string, b4: string, c4: string, d4: string, e4: string, b1: string, c1: string, d1: string, e1: string, e2: string, e3: string}} */
correctPositions

/**
 * @constructor
 * @extends {HTMLElement}
 */
var HTMLDialogElement = function() {};

/**
 * Shows a dialog element as a popover.
 * @return {void}
 */
HTMLDialogElement.prototype.showPopover = function() {};

/**
 * Closes the popover.
 * @return {void}
 */
HTMLDialogElement.prototype.close = function() {};
