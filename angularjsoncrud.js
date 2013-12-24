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
	console.log(json);
	console.log(JSON.parse(stringify(json)));
	$scope.json = json;
	$scope.isLeaf = function(obj) {
		return (obj.___VALUE___)?true:false;
	};
	$scope.strlen = function(obj) {
		var val = obj.___VALUE___;
		if(typeof val === 'string')
			return val.length;
		else //is a number or float?
			return 5; //arbitrarily small number?
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

	if(json.___VALUE___)
		return (typeof json.___VALUE___ === 'string')
			? '"' + json.___VALUE___ + '"'
			: json.___VALUE___;

	var str = "";
	if(Array.isArray(json))
	{
		str = '[\n';
		for(var i=0; i!=json.length; ++i)
		{
			for(var k=0; k!=tabs; ++k)
				str += '\t';
			str += stringify(json[i], tabs+1) + ',\n';
		}

		//remove last comma
		str = str.substr(0,str.length-2) + '\n';

		for(var i=0; i!=tabs-1; ++i)
			str += '\t';
		str += ']';
	}
	else
	{
		str = '{\n';
		for(var key in json)
			if(key != '$$hashkey') //no idea where that key is coming from
			{
				for(var i=0; i!=tabs; ++i)
					str += '\t';
				str += '"' + key + '": ' + stringify(json[key], tabs+1) + ',\n';
			}

		//remove last comma
		str = str.substr(0,str.length-2) + '\n';

		for(var i=0; i!=tabs-1; ++i)
			str += '\t';
		str += '}';
	}

	return str;
}

//TODO: remove
function unreferencify(json)
{
	console.log("in unreferencify");
	if(json["___VALUE___"])
		return json["___VALUE___"];
	for(var key in json)
		if(key !== "___VALUE___")
			json[key] = referencify(json[key]);

	return json;
}
