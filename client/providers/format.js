function format() {	

		function getTimeStamp(ms){
			var sec = Math.floor((ms/1000) % 60);
			var min = Math.floor((ms/(1000*60)) % 60);
			var hour = Math.floor((ms/(1000*60*60)));
			return ("0"+hour).slice(-2) + ":"+ ("0"+min).slice(-2) + ":" + ("0"+sec).slice(-2);
		}

		function formatPace(secPerKm){
			var min = Math.floor(secPerKm/60);
			var sec = Math.floor(secPerKm%60);
			return min +":"+("0"+sec).slice(-2);
		}

		return {
			getTimeStamp: getTimeStamp,
			formatPace: formatPace
		};

	}
module.exports = format;