//function jsoncrudctrl($scope, $location, $http)
angular.module('jsoncrudapp', ['contenteditable'])
	.controller('jsoncrudctrl', ['$scope', function($scope)
{
	var json = {
		field1: "some text",
		array1: ["an", "array"],
		obj1: {
			key1: 8,
			key2: "more text",
		},
		field2: "loremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsumloremipsum",
	};
	$scope.value = json;

	$scope.updateKey = updateKey;
	$scope.isLeaf = function(obj) {
		return (typeof obj !== "object")?true:false;
	};
	$scope.stringify = function(obj) {
		return JSON.stringify(obj, null, '\t');
	};
	$scope.addToArray = function(arr) {
		arr.push("");
	};
	var keyPrefix = "_key"; var keyCount = 0;
	$scope.addToObject = function(object) {
		object[keyPrefix + keyCount] = "";
	};
	$scope.isArray = Array.isArray;
	$scope.isObject = function(obj) {
		return (typeof obj === "object" && !Array.isArray(obj))?true:false;
	};
	$scope.objlength = function(obj) {
		if(Array.isArray(obj))
			return obj.length;
		else {
			var count = 0;
			for(var key in obj)
				++count;

			return count;
		}
	};
	$scope.loadJson = function(jsonUrl) {
		$http.get(jsonUrl).success(function(json) {
			$scope.value = json
		}).error(function(err) {
			console.log(err);
			alert("loading the json failed");
		});
	};
	$scope.isUndefined = function(obj) {
		return ((typeof obj == "undefined") ? true : false);
	}
	$scope.deleteElement = function(key, obj)
	{
		var confirmed = true;
		if(!$scope.isLeaf(obj[key]))
			confirmed = confirm("Are you sure you want to delete an object/array?");

		if(confirmed) {
			if(Array.isArray(obj))
				obj.splice(key, 1);
			else
				delete obj[key];
		}
	};
	$scope.linkify = linkify;
}]);

//To add links I'll need to ditch ng-model, which I don't want to yet.
function linkify(str)
{
	return str.replace(/(http:\/\/[^\w]*)/gi, function(match, p1, offset, string) {
		return '<a href="' + p1 + '">' + p1 + '</a>';
	});
}

//The complexity of this function is only because it's jarring to change the order of object elements. If I had another solution for display order, then I could simply use the first two commented lines.
function updateKey(object, key, $parent) {
	//object[key] = object[$parent.key];
	//delete object[$parent.key];
	
	//doing this JUST so the order is preserved when modifying a key.
	var pastKey = false;
	var kvpsAfter = {};
	var value = object[$parent.key];
	for(var k in object)
	{
		if(k === $parent.key)
		{
			pastKey = true;
			delete object[k]	//remove element with old key
			continue;
		}
		else if(pastKey)
		{
			kvpsAfter[k] = object[k];
			delete object[k];
		}
	}
	object[key] = value;
	//readd past elements
	for(var k in kvpsAfter)
		object[k] = kvpsAfter[k];
};
