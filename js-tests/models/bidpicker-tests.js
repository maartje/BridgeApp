define(function(require) {
    var assert = require('chai').assert;
    var bidpickerModule = require('models/bidpicker');
    var testDataModule = require('../data/test-data');
    var bidModule = require("models/bid");

    suite('Bidpicker', function() {
        test('#Bidpicker constructs a bidpicker with default values', function() {
            // arrange
            var bidpicker = new bidpickerModule.Bidpicker();

            // assert
            assert.lengthOf(bidpicker.specialBids, 3);
            assert.lengthOf(bidpicker.suitBids, 5 * 7);
            assert.isUndefined(bidpicker.preselectedBid());
            assert.lengthOf(bidpicker.bidconventions(), 0);
            assert.equal(bidpicker.visible(), false);
            assert.equal(bidpicker.left(), - 1000);
            assert.equal(bidpicker.top(), - 1000);
        });
        test('#cssBidButton contains a css class that tells whether a bid is preselected', function() {
            // arrange
            var bidpicker = new bidpickerModule.Bidpicker();
            var pass  = new bidModule.createBid({
                type: "PASS"
            });
            bidpicker.preselectedBid(pass);

            //act
            var css_pass = bidpicker.cssBidButton(testDataModule.pass);
            var css_dbl = bidpicker.cssBidButton(testDataModule.dbl);
            
            // assert
            assert.include(css_pass, "preselected-bid");
            assert.notInclude(css_dbl, "preselected-bid");
        });

        test('#invalidatesCurrentBidsequence tells whether a bid is invalid', function() {
            // arrange
            var bidpicker = new bidpickerModule.Bidpicker();
            bidpicker.bidconventions([testDataModule.bc_1nt_pass_2h]);

            // assert
            assert.isFalse(bidpicker.invalidatesCurrentBidsequence(testDataModule.pass));
            assert.isFalse(bidpicker.invalidatesCurrentBidsequence(testDataModule.bid_2c));
            assert.isTrue(bidpicker.invalidatesCurrentBidsequence(testDataModule.dbl));
            assert.isTrue(bidpicker.invalidatesCurrentBidsequence(testDataModule.bid_1c));
        });
        test('#cssBidButton invalidatesSubsequentBidsequences tells whether a bid invalidates current or subsequent biddings', function() {
            // arrange
            var bidpicker = new bidpickerModule.Bidpicker();
            bidpicker.bidconventions([testDataModule.bc_1nt]);

            //act
            var css_pass = bidpicker.cssBidButton(testDataModule.pass);
            var css_1c = bidpicker.cssBidButton(testDataModule.bid_1c);
            var css_2c = bidpicker.cssBidButton(testDataModule.bid_2c);
            var css_dbl = bidpicker.cssBidButton(testDataModule.dbl); //invalid itself

            // assert
            assert.isFalse(bidpicker.invalidatesSubsequentBidsequences(testDataModule.pass));
            assert.isFalse(bidpicker.invalidatesSubsequentBidsequences(testDataModule.bid_1c));
            assert.isTrue(bidpicker.invalidatesSubsequentBidsequences(testDataModule.dbl));
            assert.isTrue(bidpicker.invalidatesSubsequentBidsequences(testDataModule.bid_2c));
        });


        test('#cssBidButton contains a css class that tells whether a bid is invalid', function() {
            // arrange
            var bidpicker = new bidpickerModule.Bidpicker();
            bidpicker.bidconventions([testDataModule.bc_1nt_pass_2h]);

            //act
            var css_pass = bidpicker.cssBidButton(testDataModule.pass);
            var css_2c = bidpicker.cssBidButton(testDataModule.bid_2c);

            var css_dbl = bidpicker.cssBidButton(testDataModule.dbl);
            var css_1c = bidpicker.cssBidButton(testDataModule.bid_1c);

            // assert
            assert.include(css_dbl, "invalid-bid");
            assert.include(css_1c, "invalid-bid");
            assert.notInclude(css_pass, "invalid-bid");
            assert.notInclude(css_2c, "invalid-bid");
        });
        test('#cssBidButton contains a css class that tells whether a bid invalidates subsequent biddings', function() {
            // arrange
            var bidpicker = new bidpickerModule.Bidpicker();
            bidpicker.bidconventions([testDataModule.bc_1nt]);

            //act
            var css_pass = bidpicker.cssBidButton(testDataModule.pass);
            var css_1c = bidpicker.cssBidButton(testDataModule.bid_1c);
            var css_2c = bidpicker.cssBidButton(testDataModule.bid_2c);
            var css_dbl = bidpicker.cssBidButton(testDataModule.dbl); //invalid itself

            // assert
            assert.include(css_2c, "invalidates-succeeding-bids");
            assert.notInclude(css_pass, "invalidates-succeeding-bids");
            assert.notInclude(css_1c, "invalidates-succeeding-bids");
            assert.notInclude(css_dbl, "invalidates-succeeding-bids");
        });

    });
});