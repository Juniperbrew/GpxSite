api.$inject = ['$http'];

function api($http) {
	
	function getActivities(){
		return $http.get('api/activities')
			.then(function(result) {
				return result.data;
			});
	}

	function getActivity(id){
		return $http.get('api/activity/',{ params: { id: id }})
  			.then(function(result) {
  				return result.data;
  			})
	}

	return {
		getActivities: getActivities,
		getActivity: getActivity
	};

}

module.exports = api;