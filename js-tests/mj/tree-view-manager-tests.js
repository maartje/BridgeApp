define(function(require) {
    var assert = require('chai').assert;
    var selectionManagerModule = require('mj/selection-manager');
    var clipboardManagerModule = require('mj/clipboard-manager');
    var treeViewManagerModule = require('mj/tree-view-manager');

    //system under test
    var treeViewManager;

    //data
    var StubNode = function(id, children) {
        this._id = id;
        this._children = children;
        this._parent = null;

        this.getChildren = function() {
            return this._children;
        };

        this.getParent = function() {
            return this._parent;
        };
        
        this.getRoot = function() {
            if (!this._parent) {
                return this;
            }
            return this._parent.getRoot();
        };

    };

    var node_0100 = new StubNode("node_0100", []);
    var node_0101 = new StubNode("node_0101", []);
    var node_010 = new StubNode("node_010", [node_0100, node_0101]);
    var node_00 = new StubNode("node_00", []);
    var node_01 = new StubNode("node_01", [node_010]);
    var node_0 = new StubNode("node_0", [node_00, node_01]);
    node_0100._parent = node_010;
    node_0101._parent = node_010;
    node_010._parent = node_01;
    node_00._parent = node_0;
    node_01._parent = node_0;


    setup(function() {
        var selectionManager = new selectionManagerModule.SelectionManager();
        var clipboardManager = new clipboardManagerModule.ClipboardManager(selectionManager);
        treeViewManager = new treeViewManagerModule.TreeViewManager(clipboardManager, node_0);
    });

    suite('TreeViewManager', function() {

		test('initially, only the root node is opened', function() {
			assert.isTrue(treeViewManager.isOpen(node_0));
			assert.isFalse(treeViewManager.isOpen(node_00));
			assert.isFalse(treeViewManager.isOpen(node_01));
			assert.isFalse(treeViewManager.isOpen(node_010));
			assert.isFalse(treeViewManager.isOpen(node_0100));
			assert.isFalse(treeViewManager.isOpen(node_0101));
		});
		
		test('#setRoot(node); getRoot() sets, respectively gets, the node that serves as the root for the treeview', function() {
			treeViewManager.setRoot(node_01);
			assert.equal(treeViewManager.getRoot(), node_01);
		});

		test('TODO: setRoot(node) closes all open nodes that are not descendants of the root view', function() {
			treeViewManager.toggleOpenClose(node_01);
			treeViewManager.toggleOpenClose(node_010);
			treeViewManager.toggleOpenClose(node_0100);
			treeViewManager.toggleOpenClose(node_0101);
			
			treeViewManager.setRoot(node_010);
			//TODO: ...
			
		}); 

		test('#setRoot(node) deselects all selected nodes', function() {
			treeViewManager.selectAll([node_00, node_01]);

			treeViewManager.setRoot(node_01);
			
			assert.lengthOf(treeViewManager.getSelectedItems(), 0);
		});

		test('#setRoot(node) does not change the viewstate in case the root is not actually changed', function() {
			treeViewManager.setRoot(node_01);
			treeViewManager.selectAll([node_0100, node_010]);

			treeViewManager.setRoot(node_01);
			
			assert.lengthOf(treeViewManager.getSelectedItems(), 2);
			assert.isTrue(treeViewManager.isSelected(node_0100));
			assert.isTrue(treeViewManager.isSelected(node_010));
		});

		
		test('#toggleOpenClose(node) opens the given node in case it was previously closed', function() {
			// act
			treeViewManager.toggleOpenClose(node_01);

			// assert
			assert.isTrue(treeViewManager.isOpen(node_01));
		});
		test('#toggleOpenClose(node) closes the given node in case it was previously open', function() {
			// arrange
			treeViewManager.toggleOpenClose(node_01);

			// act
			treeViewManager.toggleOpenClose(node_01);

			// assert
			assert.isFalse(treeViewManager.isOpen(node_01));
		});
		test('#toggleOpenClose(node) also closes all descendants of a node that was previously open', function() {
			// arrange 			
			treeViewManager.toggleOpenClose(node_01);
			treeViewManager.toggleOpenClose(node_010);

			// act
			treeViewManager.toggleOpenClose(node_0);

			// assert
			assert.isFalse(treeViewManager.isOpen(node_0));
			assert.isFalse(treeViewManager.isOpen(node_01));
			assert.isFalse(treeViewManager.isOpen(node_010));
		});
		test('#toggleOpenClose(node) does not open the descendants of a node that was previously closed', function() {
			// arrange 			
			treeViewManager.toggleOpenClose(node_0);

			// act
			treeViewManager.toggleOpenClose(node_0);

			// assert
			assert.isTrue(treeViewManager.isOpen(node_0));
			assert.isFalse(treeViewManager.isOpen(node_00));
			assert.isFalse(treeViewManager.isOpen(node_01));
			assert.isFalse(treeViewManager.isOpen(node_010));
		});
		
		test('#openSelected(true) recursively opens the selected nodes, including their descendant nodes', function() {
			// arrange
			treeViewManager.selectAll([node_00, node_01]);

			// act
			treeViewManager.openSelected(true);

			// assert
			assert.isTrue(treeViewManager.isOpen(node_01));
			assert.isTrue(treeViewManager.isOpen(node_00));
			assert.isTrue(treeViewManager.isOpen(node_010));
			assert.isTrue(treeViewManager.isOpen(node_0100));
			assert.isTrue(treeViewManager.isOpen(node_0101));
		});

		test('#openSelected(false) opens the selected nodes, without opening their descendant nodes', function() {
			// arrange
			treeViewManager.selectAll([node_00, node_01]);

			// act
			treeViewManager.openSelected(false);

			// assert
			assert.isTrue(treeViewManager.isOpen(node_01));
			assert.isTrue(treeViewManager.isOpen(node_00));
			assert.isFalse(treeViewManager.isOpen(node_010));
			assert.isFalse(treeViewManager.isOpen(node_0100));
			assert.isFalse(treeViewManager.isOpen(node_0101));
		});

		test('#openSelected() opens the selected nodes, without opening their descendant nodes', function() {
			// arrange
			treeViewManager.selectAll([node_00, node_01]);

			// act
			treeViewManager.openSelected();

			// assert
			assert.isTrue(treeViewManager.isOpen(node_01));
			assert.isTrue(treeViewManager.isOpen(node_00));
			assert.isFalse(treeViewManager.isOpen(node_010));
			assert.isFalse(treeViewManager.isOpen(node_0100));
			assert.isFalse(treeViewManager.isOpen(node_0101));
		});


		test('#closeSelected(true) recursively closes the selected nodes, including their descendant nodes', function() {
			// arrange
			treeViewManager.toggleOpenClose(node_01);
			treeViewManager.toggleOpenClose(node_010);
			treeViewManager.toggleOpenClose(node_0100);
			treeViewManager.toggleOpenClose(node_0101);
			treeViewManager.selectAll([node_00, node_01]);

			// act
			treeViewManager.closeSelected(true);

			// assert
			assert.isFalse(treeViewManager.isOpen(node_01));
			assert.isFalse(treeViewManager.isOpen(node_00));
			assert.isFalse(treeViewManager.isOpen(node_010));
			assert.isFalse(treeViewManager.isOpen(node_0100));
			assert.isFalse(treeViewManager.isOpen(node_0101));
		});

		test('#closeSelected(false) closes the selected nodes, without closing their descendant nodes', function() {
			// arrange
			treeViewManager.toggleOpenClose(node_01);
			treeViewManager.toggleOpenClose(node_010);
			treeViewManager.toggleOpenClose(node_0100);
			treeViewManager.toggleOpenClose(node_0101);
			treeViewManager.selectAll([node_00, node_01]);

			// act
			treeViewManager.closeSelected(false);

			// assert
			assert.isFalse(treeViewManager.isOpen(node_01));
			assert.isFalse(treeViewManager.isOpen(node_00));
			assert.isTrue(treeViewManager.isOpen(node_010));
			assert.isTrue(treeViewManager.isOpen(node_0100));
			assert.isTrue(treeViewManager.isOpen(node_0101));
		});

		test('#closeSelected() recursively closes the selected nodes, including(!) their descendant nodes', function() {
			// arrange
			treeViewManager.toggleOpenClose(node_01);
			treeViewManager.toggleOpenClose(node_010);
			treeViewManager.toggleOpenClose(node_0100);
			treeViewManager.toggleOpenClose(node_0101);
			treeViewManager.selectAll([node_00, node_01]);

			// act
			treeViewManager.closeSelected();

			// assert
			assert.isFalse(treeViewManager.isOpen(node_01));
			assert.isFalse(treeViewManager.isOpen(node_00));
			assert.isFalse(treeViewManager.isOpen(node_010));
			assert.isFalse(treeViewManager.isOpen(node_0100));
			assert.isFalse(treeViewManager.isOpen(node_0101));
		});

		test('#reset() deselects all selected nodes', function() {
			// arrange
			treeViewManager.selectAll(node_00, node_01);

			// act
			treeViewManager.reset();

			// assert
			assert.isFalse(treeViewManager.isSelected(node_00));
			assert.isFalse(treeViewManager.isSelected(node_01));
		});

		test('#reset() sets the data root as the view root', function() {
			// arrange
			treeViewManager.setRoot(node_010);
 			assert.equal(treeViewManager.getRoot(), node_010);

			// act
			treeViewManager.reset();

			// assert
 			assert.equal(treeViewManager.getRoot(), node_0);
		});

		test('#reset() ensures that only the root node is open', function() {
			// arrange
			treeViewManager.toggleOpenClose(node_01);
			treeViewManager.toggleOpenClose(node_010);

			// act
			treeViewManager.reset();

			// assert
			assert.isTrue(treeViewManager.isOpen(node_0));
			assert.isFalse(treeViewManager.isOpen(node_01));
			assert.isFalse(treeViewManager.isOpen(node_01));
		});

		test('#setFocus(nodes) ensures that exactly the given nodes are selected', function() {
			// arrange

			// act
			treeViewManager.setFocus([node_00, node_010]);

			// assert
			assert.deepEqual(treeViewManager.getSelectedItems(), [node_00, node_010]);
		});

		test('#setFocus(nodes) ensures that the given nodes are visible, i.e. their ancestors are open', function() {
			// arrange

			// act
			treeViewManager.setFocus([node_00, node_0101]);

			// assert
			assert.isTrue(treeViewManager.isOpen(node_0));
			assert.isTrue(treeViewManager.isOpen(node_01));
			assert.isTrue(treeViewManager.isOpen(node_010));
		});

		test('#setFocus(nodes) ensures that the given nodes are visible, i.e. a common ancestor is set as root', function() {
			// arrange
			treeViewManager.setRoot(node_010)

			// act
			treeViewManager.setFocus([node_00, node_0101]);

			// assert
			assert.equal(treeViewManager.getRoot(), node_0);
		});

		test('TODO: #setFocus(nodes) sets the lowest common ancestor as root of the view', function() {
		    //TODO
		});

		test('#setFocus(nodes) does not modify any other open/close state', function() {
			// arrange
			treeViewManager.toggleOpenClose(node_00);

			// act
			treeViewManager.setFocus([node_00, node_0101]);

			// assert
			assert.isFalse(treeViewManager.isOpen(node_0101));
			assert.isTrue(treeViewManager.isOpen(node_00));
			assert.isFalse(treeViewManager.isOpen(node_0100));
		});

    });
});