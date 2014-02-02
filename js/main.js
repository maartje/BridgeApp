require.config({
  paths: {
      jquery: ['libs/jquery-1.10.2'],
      'jquery-ui': ['libs/jquery-ui-1.10.3'],
      'knockout': ['libs/knockout-2.2.1'],
      'knockout-validation': ['libs/knockout-validation'],
      'knockout-mapping' : ['libs/knockout-mapping-2.4.1']
  },
  
  shim: {
	  'jquery': {
          exports: ['jquery', '$']
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
      },
      "libs/jquery.jeegoocontext" : {
          deps: ['jquery']
      }
  }
});
 
require(['require', 'knockout', 'models/bid-system', 'storage/default-data', 'jquery', "libs/jquery.jeegoocontext"], 
function(require, ko, bidSystemModule, defaultDataModule, $){
    //localStorage.clear();
    var bidSystemId = "maartje_wim";
    var bidSystem = bidSystemModule.load(bidSystemId);
    if (!bidSystem) {
    	var bidSystemData = defaultDataModule.defaultBiddingSystem;
    	bidSystemData.id = bidSystemId;
    	bidSystemModule.save(bidSystemData);
        bidSystem = bidSystemModule.load(bidSystemId);
    }
    ko.applyBindings(bidSystem);
    
    $('.context').jeegoocontext('menu');

});