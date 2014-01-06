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
	json = referencify(json);
	$scope.logger = function(str) { console.log(str); };
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
		return (obj.___VALUE___ !== undefined)?true:false;
	};
	$scope.strlen = function(obj) {
		var val = obj.___VALUE___;
		if(typeof val === 'string')
			return val.length;
		else //is a number
			return 1; //arbitrarily small number?
	};
	$scope.stringify = stringify;
	$scope.addToArray = function(arr) {
		arr.push({___VALUE___: ""});
	}
	$scope.isArray = Array.isArray;
	$scope.loadJson = function(jsonUrl) {
		$http.get(jsonUrl).success(function(json) {
			$scope.value = referencify(json);
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
	}
}]);

//puts all leafs into objects with the key __value__ so i can reference them in angular.
function referencify(json)
{
	for(var key in json)
	{
		if(angular.isObject(json[key])) {
			json[key] = referencify(json[key]);
			json[key]["___KEY___"] = key;
		}
		else
			json[key] = {"___VALUE___": json[key], "___KEY___": key};
	}

	return json;
}

function stringify(json, tabs)
{
	if(!tabs)
		tabs = 1;

	if(json.___VALUE___ !== undefined)
		return (typeof json.___VALUE___ === 'string')
			? '"' + json.___VALUE___ + '"'
			: json.___VALUE___;

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
			if(key != '$$hashkey' && key != '___KEY___') //no idea where that key is coming from
				str += ntimes('\t', tabs) + '"' + json[key].___KEY___ + '": ' + stringify(json[key], tabs+1) + ',\n';

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
