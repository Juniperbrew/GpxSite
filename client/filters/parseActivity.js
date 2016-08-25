function parseActivity() {
	 return function(input) {
    return input.split(" ")[0];
  };
};

module.exports = parseActivity;