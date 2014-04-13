define(function(require) {
	var assert = require('chai').assert;
	var treeViewModule = require('mj/tree-view');
	var treeViewManagerModule = require('mj/tree-view-manager');
	var clipboardManagerModule = require('mj/clipboard-manager');

	suite('TreeView', function() {
		test('#setRoot(node); getRoot() sets/gets the node as the root for the treeview', function() {
			// arrange
			var treeView = new treeViewModule.TreeView();
			var node = {id : "1"};

			// act
			treeView.setRoot(node);

			// assert
			assert.equal(treeView.getRoot(), node);
		});
		test('#createChildren(childData) calls node.createChild(childData) on selected nodes', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var clipboardManager = new clipboardManagerModule.ClipboardManager();
			var treeView = new treeViewModule.TreeView(treeViewManager, clipboardManager);

			var node1 = {children : []};
			var node2 = {children : []};
			var child = {id : 1};
			node1.createChild = node2.createChild = function(childData){
				this.children.push(childData);
				return childData;
			};

			// act
			treeView.toggleSelect(node1);
			treeView.toggleSelect(node2);
			treeView.createChildren(child);

			// assert
			assert.equal(node1.children[0], child);
			assert.equal(node2.children[0], child);
		});
		test('#createChildren(childData) deselects the parent nodes and selects the child nodes', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var clipboardManager = new clipboardManagerModule.ClipboardManager();
			var treeView = new treeViewModule.TreeView(treeViewManager, clipboardManager);
			var node1 = {children : []};
			var node2 = {children : []};
			node1.createChild = node2.createChild = function(childData){
				this.children.push(childData);
				return childData;
			};

			// act
			treeView.toggleSelect(node1);
			treeView.toggleSelect(node2);
			treeView.createChildren({id : 1});

			// assert
			assert.isFalse(treeView.isSelected(node1));
			assert.isFalse(treeView.isSelected(node2));
			assert.isTrue(treeView.isSelected(node1.children[0]));
			assert.isTrue(treeView.isSelected(node2.children[0]));
		});
		test('#createChildren(childData) ensures that the parent nodes are open', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var clipboardManager = new clipboardManagerModule.ClipboardManager();
			var treeView = new treeViewModule.TreeView(treeViewManager, clipboardManager);
			var node1 = {children : []};
			var node2 = {children : []};
			var node3 = {children : []};
			node1.createChild = node2.createChild = function(childData){
				this.children.push(childData);
				return childData;
			};

			// act
			treeView.toggleSelect(node1);
			treeView.toggleSelect(node2);
			treeView.toggleOpenClose(node2);
			treeView.toggleOpenClose(node3);			
			treeView.createChildren({id : 1});

			// assert
			assert.isTrue(treeView.isOpen(node1));
			assert.isTrue(treeView.isOpen(node2));
			assert.isTrue(treeView.isOpen(node3));
		});
		test('#createSiblings(childData) calls node.createSibling(siblingData) on selected nodes', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var clipboardManager = new clipboardManagerModule.ClipboardManager();
			var treeView = new treeViewModule.TreeView(treeViewManager, clipboardManager);

			var node1 = {parent : {children : [node1]}};
			var node2 = {parent : {children : [node2]}};
			var sibling = {id : 1};
			node1.createSibling = node2.createSibling = function(siblingData){
				this.parent.children.push(siblingData);
				return siblingData;
			};

			// act
			treeView.toggleSelect(node1);
			treeView.toggleSelect(node2);
			treeView.createSiblings(sibling);

			// assert
			assert.equal(node1.parent.children[1], sibling);
			assert.equal(node2.parent.children[1], sibling);
		});
		test('#createSiblings(childData) deselects the parent nodes and selects the child nodes', function() {
			// arrange
			var treeViewManager = new treeViewManagerModule.TreeViewManager();
			var clipboardManager = new clipboardManagerModule.ClipboardManager();
			var treeView = new treeViewModule.TreeView(treeViewManager, clipboardManager);

			var node1 = {parent : {children : [node1]}};
			var node2 = {parent : {children : [node2]}};
			var sibling = {id : 1};
			node1.createSibling = node2.createSibling = function(siblingData){
				this.parent.children.push(siblingData);
				return siblingData;
			};

			// act
			treeView.toggleSelect(node1);
			treeView.toggleSelect(node2);
			treeView.createSiblings({id : 1});

			// assert
			assert.isFalse(treeView.isSelected(node1));
			assert.isFalse(treeView.isSelected(node2));
			assert.isTrue(treeView.isSelected(node1.parent.children[1]));
			assert.isTrue(treeView.isSelected(node2.parent.children[1]));
		});
	});
});