require.config({
  paths: {
      jquery: ['libs/jquery-1.10.2'],
      'jquery-ui': ['libs/jquery-ui-1.10.3'],
      'knockout': ['libs/knockout-2.2.1'],
      'knockout-validation': ['libs/knockout-validation'],
      'knockout-mapping' : ['libs/knockout-mapping-2.4.1']
  },
  
  shim: {
	  'jQuery': {
          exports: ['jQuery', '$']
      },
      'jquery-ui': {
    	  exports: '$',
          deps: ['jquery']
      },
      'knockout': {
          deps: ['jquery'],
          exports: 'ko'
      },
      'knockout-mapping': {
          deps: ['knockout']
      }
  }
});
 
require(['require', 'knockout', "models/bid"], function(require, ko, bidModule){
	var bid = new bidModule.Bid({type : "SUIT", suit : "CLUBS", level : 2});
    ko.applyBindings(bid);   	

	var unvalidBid = new bidModule.Bid({type : "SUIT", suit : "CLUBS", level : 9});
    ko.applyBindings(unvalidBid);   	
});