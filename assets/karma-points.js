/* You can use this directive with the following tag <stamplay karma-points></stamplay> */

app.directive('karmaPoints', ['userService', 'karmaService',

	function (userService, karmaService) {
		return {
			require: '^stamplay',
			scope: {},
			templateUrl: function (elem, attrs) {
				var _url = _ASSETS_URL + '/assets/';
				return (attrs.templateUrl) ? _url + attrs.templateUrl : _url + 'karma-points.html';
			},
			link: function (scope, element, attrs, sc) {
				scope.user = userService.getUser();
				// scope.$parent.listenOnUser(scope);
				if (scope.user) {
					karmaService.getKarmaPoints(scope.user['_id']).success(function (response) {
						scope.points = response.points || '0';
					})
				}
			}
		};
}]);