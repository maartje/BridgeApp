define(function(require, exports, module) {
	var MIXIN = module.exports.MIXIN = function(mixMeIn, extendMe) {
		var prop;
		for (prop in mixMeIn) {
			if (typeof mixMeIn[prop] === 'function' && !extendMe[prop]) {
				extendMe[prop] = mixMeIn[prop].bind(mixMeIn);
			}
		}
	};
});
