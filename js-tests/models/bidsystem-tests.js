define(function(require) {
    var assert = require('chai').assert;
    var testDataModule = require('../data/test-data');
    var bidsystemModule = require('models/bidsystem');
    var bidconventionModule = require('models/bidconvention');

    suite('Bidsystem', function() {
        suite('Construction', function() {
            test('#Bidsystem(data) properties are set from the data object', function() {
                // arrange
                var jsonData = testDataModule.biddingSystemData;

                // act
                var bidsystem = new bidsystemModule.Bidsystem(jsonData);

                // assert
                assert.equal(bidsystem.id, jsonData.id);
                assert.instanceOf(bidsystem.bidRoot, bidconventionModule.Bidconvention);
                assert.instanceOf(bidsystem.bidRootOpponent, bidconventionModule.Bidconvention);
                assert.equal(bidsystem.bidRoot.children().length, jsonData.bidRoot.children.length);
                assert.equal(bidsystem.bidRootOpponent.children().length, jsonData.bidRootOpponent.children.length);
            });
            test('#Bidsystem(data) default values are set for properties that are missed in the data object', function() {
                // arrange

                // act
                var bidsystem = new bidsystemModule.Bidsystem();

                // assert
                assert.isUndefined(bidsystem.id);
                assert.instanceOf(bidsystem.bidRoot, bidconventionModule.Bidconvention);
                assert.instanceOf(bidsystem.bidRootOpponent, bidconventionModule.Bidconvention);
                assert.equal(bidsystem.bidRoot.children().length, 0);
                assert.equal(bidsystem.bidRootOpponent.children().length, 0);
            });

        });
        suite('Serialization and persistence', function() {
            test('#toJSON serializes bidRoot, bidRootOpponent, and id', function() {
                // arrange
                var bidsystem = testDataModule.biddingSystem;

                // act
                var jsonData = bidsystem.toJSON();

                // assert
                assert.property(jsonData, 'id');
                assert.property(jsonData, "bidRoot");
                assert.property(jsonData, "bidRootOpponent");
            });
            test('#saveToLocalStorage calls the save method in the local storage module', function() {
                // arrange
                var bidsystem = testDataModule.biddingSystem;
                var ls = require('storage/local-storage');
                var saveArgs = [];
                ls.save = function(key, value) {
                    saveArgs = [key, value];
                };

                // act
                bidsystem.saveToLocalStorage();

                // assert
                assert.equal(saveArgs[0], bidsystem.id);
                assert.equal(saveArgs[1], bidsystem);
            });
            test('#loadFromLocalStorage calls the load method in the local storage module', function() {
                // arrange
                var bidsystem = testDataModule.biddingSystem;
                var ls = require('storage/local-storage');
                var loadArgs = [];
                ls.load = function(key) {
                    loadArgs = [key];
                };

                // act
                bidsystem.loadFromLocalStorage();

                // assert
                assert.equal(loadArgs[0], bidsystem.id);
            });
        });
    });
});