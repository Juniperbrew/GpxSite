UploadController.$inject = ['fileUpload'];

function UploadController(fileUpload) {
	var vm = this;
    vm.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "/api/activity";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
};