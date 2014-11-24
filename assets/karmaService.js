app.factory('karmaService', ['$http',
	function ($http) {

		var getKarmaPoints = function (userId) {
			return $http({
				method: 'GET',
				url: '/api/gm/v0/challenges/hnkarma/userchallenges/' + userId,
			});
		}

		return {
			getKarmaPoints: getKarmaPoints
		}

}]);