/**
 * Implements handlers for UI-events and provides access
 * to data and view-state. 
 * Mixes in the functionality of a @ClipboardManager.
 * Mixes in the functionality of a @TreeviewManager.
 * Remark: works on items that implement the 
 * functions @moveTo, @copyTo, @getChildren, @getParent, @createChild.
 */
define(function(require, exports, module) {
	var ko = require("knockout");
	var mixinModule = require("util/mixin");

	var BridgeApp = module.exports.BridgeApp = function(root, treeViewManager, clipboardManager) {
		this._root = root;
		this._treeViewManager = treeViewManager;
		this._clipboardManager = clipboardManager;
	};

	BridgeApp.prototype = function() {
		var setRoot = function(node) {
			this._root = node;
		};

		var getRoot = function() {
			return this._root;
		};

		var createChildren = function(childData) {
			//createChild for selected parent nodes
			//select child nodes (instead of parent nodes)
			//ensure parents of created nodes are open
			var selectedNodes = this._clipboardManager.getSelectedItems();
			this._clipboardManager.clearSelection();
			for (var i = 0; i < selectedNodes.length; i++) {
				var parentNode = selectedNodes[i];
				var childNode = parentNode.createChild(childData);
				this._treeViewManager.open(parentNode);
				this._clipboardManager.select(childNode);
			}
		};

		var createSiblings = function(siblingData) {
			//createChild for selected parent nodes
			//select child nodes (instead of parent nodes)
			//ensure parents of created nodes are open
			var selectedNodes = this._clipboardManager.getSelectedItems();
			this._clipboardManager.clearSelection();
			for (var i = 0; i < selectedNodes.length; i++) {
				var selectedNode = selectedNodes[i];
				var siblingNode = selectedNode.createSibling(siblingData);
				this._clipboardManager.select(siblingNode);
			}
		};

		var select = function(node) {
			this._clipboardManager.select(node);
		};

		var toggleSelect = function(node) {
			this._clipboardManager.toggleSelect(node);
		};

		var selectRange = function(node) {

		};

		var clearSelection = function(node) {
			this._clipboardManager.clearSelection();
		};

		var deleteSelection = function(node) {

		};

		var cut = function(node) {

		};

		var copy = function(node) {

		};

		var paste = function(node) {

		};

		var isCut = function(node) {

		};

		var isSelected = function(node) {
			return this._clipboardManager.isSelected(node);
		};

		var toggleOpenClose = function(node) {
			this._treeViewManager.toggleOpenClose(node);
		};

		var isOpen = function(node) {
			return this._treeViewManager.isOpen(node);
		};

		return {
			//set/get top node
			setRoot: setRoot, //Alt + T
			getRoot: getRoot,

			//create nodes
			createChildren: createChildren, //Alt + N
			createSiblings: createSiblings, //Alt + S

			//manage the collection of selected items
			select: select, //click
			toggleSelect: toggleSelect, //Ctrl click
			selectRange: selectRange, //Shift click
			clearSelection: clearSelection, //'blur'
			isSelected: isSelected,

			//delete/cut/copy/paste functionality
			deleteSelection: deleteSelection, //delete
			cut: cut, //Ctrl X
			copy: copy, //Ctrl C
			paste: paste, //Ctrl V
			isCut: isCut,

			// open and close functionality
			toggleOpenClose: toggleOpenClose,
			isOpen: isOpen,
		};
	}();
});