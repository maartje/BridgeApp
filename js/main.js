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
 
require(['require', 'knockout', 'models/bid-system'], function(require, ko, bidSystemModule){
	var bidsystem = new bidSystemModule.BidSystem({
		id : "maartje_wim",
		bidRoot : {
			id : "root_id",
			children : [{
				id : 1,
				bid : {
					type : "SUIT",
					suit : "CLUBS", 
					level : 1
				},
				convention : "12-19 punten. Vanaf een 3 kaart.",
				children : [{
					id : 2,
					bid : {
						type : "PASS",
					},
					convention : "",
					children : []}
				, { id : 3,
					bid : {
						type : "SUIT",
						suit : "SPADES", 
						level : 2
					},
					convention : "informatie doublet"}]}]}
	});
	
	var s = JSON.stringify(bidsystem);
	var js = JSON.parse(s);
	var obj = new bidSystemModule.BidSystem(js);
	
	console.log(bidsystem);
	console.log(obj);

});