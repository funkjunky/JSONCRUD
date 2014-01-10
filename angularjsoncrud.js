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
	$scope.logger = function(str) { console.log(str); };
	//The complexity of this function is only because it's jarring to change the order of object elements. If I had another solution for display order, then I could simply use the first two commented lines.
	$scope.updateKey = function(object, key, $parent) {
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
	$scope.value = json;
	$scope.isLeaf = function(obj) {
		return (typeof obj !== "object")?true:false;
	};

	$scope.stringify = stringify;
	$scope.addToArray = function(arr) {
		arr.push("");
	}
	$scope.isArray = Array.isArray;
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

function stringify(json, tabs)
{
	if(!tabs)
		tabs = 1;

	if(typeof json !== "object")
		return (typeof json === 'string')
			? '"' + json + '"'
			: json;

	var str = "";
	if(Array.isArray(json)) //arrays use [] and write value,
	{
		str = '[\n';
		for(var i=0; i!=json.length; ++i)
			str += ntimes('\t', tabs) + stringify(json[i], tabs+1) + ',\n';

		str = str.substr(0,str.length-2) + '\n';
		str += ntimes('\t', tabs-1) + ']';
	}
	else //objects use {} and write "key": value,
	{
		str = '{\n';
		for(var key in json)
			if(key != '$$hashkey') //no idea where that key is coming from
				str += ntimes('\t', tabs) + '"' + key + '": ' + stringify(json[key], tabs+1) + ',\n';

		str = str.substr(0,str.length-2) + '\n';
		str += ntimes('\t', tabs-1) + '}';
	}

	return str;
}
function ntimes(str, times)
{
	var ret = "";
	for(var i=0; i!=times; ++i)
		ret += str;
	return ret;
}
