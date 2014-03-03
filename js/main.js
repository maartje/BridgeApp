require.config({
    paths: {
        jquery: ['libs/jquery-1.10.2'],
        'jquery-ui': ['libs/jquery-ui-1.10.3'],
        'knockout': ['libs/knockout-2.2.1'],
        'knockout-validation': ['libs/knockout-validation'],
        'knockout-mapping': ['libs/knockout-mapping-2.4.1']
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
        "libs/jquery.jeegoocontext": {
            deps: ['jquery']
        }
    }
});

// require(['require', 'knockout', 'models/application', 'storage/default-data', 'jquery', "libs/jquery.jeegoocontext"],
// function(require, ko, appModule, defaultDataModule, $) {
//     var bidSystemId = "maartje_wim";
//     //localStorage.clear();
//     if (localStorage.getItem(bidSystemId) === null) {
//         defaultDataModule.saveToLocalStorage(bidSystemId);
//     }

//     var application = new appModule.Application({bidsystem : {id : bidSystemId}});
//     application.loadFromLocalStorage();
//     ko.applyBindings(application);
    
//     $('.context').jeegoocontext('context-menu');
// });

//Initialize application using test data 
require(['require', 'knockout', 'models/application', '../js-tests/data/test-data', 'jquery', "libs/jquery.jeegoocontext"],
function(require, ko, appModule, dataModule, $) {
    localStorage.setItem(dataModule.biddingSystemData.id, JSON.stringify(dataModule.biddingSystemData));

    var application = new appModule.Application({bidsystem : {id : dataModule.biddingSystemData.id}});
    application.loadFromLocalStorage();
    ko.applyBindings(application);
    
    $('.context').jeegoocontext('context-menu');
});
