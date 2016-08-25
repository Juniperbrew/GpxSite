function formatMessage() {
	 return function(message) {
	 	if(message.name){
	 		return message.name + ': ' + message.message;
	 	}else{
	 		console.log(message);
	 		return message;
	 	}
  };
};

module.exports = formatMessage;