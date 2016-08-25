ChatController.$inject = ['$scope','socket', 'vars'];

function ChatController($scope, socket, vars) {

		var vm = this;
		vm.value = "value";
		vm.users = [];
		vm.messages = [];
		vm.name = "null";

		vm.sendMessage = function () {
			console.log("Sending message: "+ $scope.message);
			socket.emit('new:message', $scope.message);
			$scope.message = '';
		};

		vm.changeName = function() {
			console.log('change name: ' + $scope.newName);
			socket.emit('request:name', $scope.newName);
			$scope.newName = '';
		}

		socket.on('connected', function() {
			console.log('Connected to chat');
		})

		socket.on('send:name', function(data) {
			console.log('Got name: ' + data);
			vm.name = data;
		});

		socket.on('send:userlist', function(data) {
			console.log('Userlist:');
			vm.users = data;
			console.dir(data);
		});

		socket.on('event:message', function(data) {
			console.log('Got message:');
			console.dir(data);
			vm.messages.push(data);
		});

		socket.on('event:name-change', function(data) {
			var index = vm.users.indexOf(data.old);
			if (index > -1) {
    			vm.users[index] = data.new;
			}
			if(vm.name === data.old){
				vm.messages.push('You changed name to ' + data.new + '.');
			}else{
				vm.messages.push(data.old + ' changed name to ' + data.new + '.');
			}
			
		});

		socket.on('event:join', function(data) {
			if(data != vm.name){
				vm.users.push(data);
				vm.messages.push(data + ' joined chat.');	
			}
		});

		socket.on('event:quit', function(data) {
			vm.messages.push(data + ' quit.');
			var index = vm.users.indexOf(data);
			if (index > -1) {
    			vm.users.splice(index, 1);
			}
		});
};

module.exports = ChatController;