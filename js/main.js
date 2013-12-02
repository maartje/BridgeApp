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
 
require(['require', 'knockout', 'models/bid', 'models/bid-convention'], function(require, ko, bidModule, bidConventionModule){
	var bid = new bidModule.Bid({
		suit : "CLUBS", 
		level : 1
	});
	var bidConvention1 = new bidConventionModule.BidConvention({
		id : 1,
		parent : null,
		bid : bid,
		convention : "12-19 punten. Vanaf een 3 kaart.",
		isOpponentBid : false
	});
	var bidConvention2 = new bidConventionModule.BidConvention({
		id : 2,
		parent : bidConvention1,
		bid : new bidModule.Pass(),
		convention : "",
		isOpponentBid : true
	});

});