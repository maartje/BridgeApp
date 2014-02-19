define(function(require) {
    var assert = require('chai').assert;
    var conventionModule = require('models/convention');

    suite('Convention', function() {
        test('#Convention(data) properties are set from the properties given by the data parameter', function() {
            // arrange
            var descriptionValue = "a description";

            // act
            var convention = new conventionModule.Convention({
                description: descriptionValue
            });


            // assert
            assert.equal(convention.description(), descriptionValue);
        });

        test('#Convention(data) properties are created with the right default value', function() {
            // arrange

            // act
            var convention_1 = new conventionModule.Convention({});
            var convention_2 = new conventionModule.Convention();

            // assert
            assert.equal(convention_1.description(), "");
            assert.equal(convention_2.description(), "");
        });

        test('#toJSON serializes the description property', function() {
            // arrange
            var descriptionValue = "a description";
            var convention = new conventionModule.Convention({
                description: descriptionValue
            });

            // act
            var json = convention.toJSON();


            // assert
            assert.deepEqual(json, {
                description: descriptionValue
            });
        });

    });
});