function jsoncrudctrl($scope, $location)
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
	$scope.json = json;
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
}

//puts all leafs into objects with the key __value__ so i can reference them in angular.
function referencify(json)
{
	for(var key in json)
	{
		if(angular.isObject(json[key]))
			json[key] = referencify(json[key]);
		else
			json[key] = {"___VALUE___": json[key]};
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
