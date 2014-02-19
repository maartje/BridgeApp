require.config({
  baseUrl: '../js',
  paths: {
      "jquery": ["libs/jquery-1.10.2"],
      "knockout": ["libs/knockout-2.2.1"],
      "knockout-validation": ["libs/knockout-validation"],
      "knockout_mapping" : ["libs/knockout-mapping-2.4.1"],
      'mocha': ["../js-tests/libs/mocha"],
      'chai': ["../js-tests/libs/chai"]
  },
  
  // inform requirejs that kendo ui depends on jquery
  shim: {
      "jQuery": {
          exports: "jQuery"
      },
      "knockout": {
          deps: ["jquery"],
          exports: "ko"
      },
      "knockout_mapping": {
          deps: ["knockout"]
      }
  },
  urlArgs: 'bust=' + (new Date()).getTime()
});
 
require(['require', 'mocha'], function(require){
  
  /*globals mocha */
  mocha.setup('tdd');
 
  require([
      // '../js-tests/models/bid-tests',
      // '../js-tests/models/convention-tests',
      '../js-tests/models/bidsystem-tests',
      //'../js-tests/models/bid-system-tests'
    ], function(require) {
          mocha.run();
       });
 
});