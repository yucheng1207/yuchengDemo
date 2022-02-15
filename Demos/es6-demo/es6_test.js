import { my_console_log, my_console_error } from "./my_console"
import export_default, { export1 } from "./module_test"
import * as export_test from "./module_test"

function taggedTemplateTest(...arg)
{
	return arg
}

/**
 * Let or const commands test
 */
function let_const_test()
{
	let let_a = 'test let'
	const let_b = 'test const'
	if (let_a === 'test let' && let_b === 'test const')
	{
		my_console_log('let/const test success')
	}
	else
	{
		my_console_error('let/const error')
	}
}

/**
 * Destructuring test
 */
function destructuring_test()
{
	let [destructuring_a, destructuring_b] = [1, 2, 3];
	let [destructuring_c = true] = [];
	let { destructuring_boject1, destructuring_boject2: destructuring_boject22, destructuring_boject3 } = { destructuring_boject1: "aaa", destructuring_boject2: 'bbb'};
	let destructuring_d;
	const [destructuring_string1, destructuring_string2] = 'hello';
	({destructuring_d} = {destructuring_d: 'ddd'})
	if (destructuring_a === 1
		&& destructuring_b === 2 
		&& destructuring_c === true
		&& destructuring_d === 'ddd'
		&& destructuring_boject1 === 'aaa' 
		&& destructuring_boject22 === 'bbb'
		&& destructuring_boject3 === undefined
		&& destructuring_string1 === 'h'
		&& destructuring_string2 === 'e')
	{
		my_console_log('destructuring test success')
	}
	else
	{
		my_console_error('destructuring error')
	}
}

/**
 * String test
 */
function string_test()
{
	// my_console_log('abc'.at(0))

	if ('\u01D1'.normalize() === '\u004F\u030C'.normalize())
	{
		my_console_log('normalize test success')
	}
	else
	{
		my_console_error('normalize test error')
	}

	/**
	 * string test
	 */
	let string_a = "\u0061"
	let string_b = "\u{41}\u{42}\u{43}"
	let string_c = 'Hello world!'
	if (string_a === 'a' && string_b === 'ABC' && string_c.startsWith('world', 6), string_c.endsWith('Hello', 5), string_c.includes('Hello') && 'x'.repeat(3) === 'xxx')
	{
		my_console_log('string test success')
	}
	else
	{
		my_console_error('string test error')
	}

	//es7
	if ('x'.padStart(5, 'ab') === 'ababx' && 'x'.padEnd(5, 'ab') === 'xabab')
	{
		my_console_log('padStart/padEnd success')
	}
	else
	{
		my_console_error('padStart/padEnd error')
	}

	var codePoint = 'a';
	let codePointFor = ''
	for (let codePoint of 'success')
	{
		codePointFor += codePoint
	}
	if (codePoint === String.fromCodePoint(codePoint.codePointAt(0)) && codePointFor === 'success')
	{
		my_console_log('codePoint test string success')
	}
	else
	{
		my_console_error('codePoint test string error')
	}

	/**
	 * Template string
	 */
	var templateString = 123;
	if (`templateString${templateString}` === 'templateString123')
	{
		my_console_log('template string success')
	}
	else
	{
		my_console_error('template string error')
	}

	var taggedTemplate_a = 5;
	var taggedTemplate_b = 10;

	let taggedTemplate = taggedTemplateTest`Hello ${ taggedTemplate_a + taggedTemplate_b } world ${ taggedTemplate_a * taggedTemplate_b }`
	if (taggedTemplate[0][0] === 'Hello ' && taggedTemplate[1] === 15 && taggedTemplate[2] === 50)
	{
		my_console_log('tagged template test success')
	}
	else
	{
		my_console_error('tagged template test error')
	}

	/**
	 * String raw test
	 */
	if (String.raw`Hi\n${2+3}!` === "Hi\\n5!" && String.raw({ raw: 'test' }, 0, 1, 2) === "t0e1s2t")
	{
		my_console_log('string raw test success')
	}
	else
	{
		my_console_error('string raw string error')
	}
}

/**
 * Regular test
 */
function regular_test()
{
	if (new RegExp(/abc/ig, 'i').flags === 'i'
		&& /^\uD83D/u.test('\uD83D\uDC2A') === false
		&& /^\uD83D/.test('\uD83D\uDC2A') === true
		&& /\u{20bb7}/u.test("𠮷")
		&& /a+/y.exec('aaa_aa_a')
		&& /hello\d/y.sticky)
	{
		my_console_log('RegExp success')
	}
	else
	{
		my_console_error('RegExp error')
	}
	let str = 'aaa';
	var regex = new RegExp(/a/, 'g');
	if (str.replace(regex, "b") === 'bbb' && str.match(regex).length === 3 && str.search(regex) === 0 && str.split(/\s+/))
	{
		my_console_log('string RegExp success')
	}
	else
	{
		my_console_error('string RegExp error')
	}

	function escapeRegExp(str)
	{
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	}
  
	let strEscape = '/path/to/resource.html?search=query';
	if (escapeRegExp(strEscape) === "\\/path\\/to\\/resource\\.html\\?search=query")
	{
		my_console_log('RegExp.escape success')
	}
	else
	{
		my_console_error('RegExp.escape error')
	}

}

/**
 * Number test
 */
function number_test()
{
	if (Number(0b111110111 === 503) && Number(0o767 === 503) )
	{
		my_console_log('Binary and octal testing success')
	}
	else
	{
		my_console_error('Binary and octal testing error')
	}

	if (Number.isFinite(15) && !Number.isFinite(NaN) && !Number.isFinite(Infinity) && !Number.isFinite('foo') && !Number.isFinite(true) 
		&& Number.isNaN(NaN) && !Number.isNaN('15') && Number.isNaN(9/NaN) && Number.isNaN('true'/0))
	{
		my_console_log('isFinite/isNaN success')
	}
	else
	{
		my_console_error('isFinite/isNaN error')
	}

	if (parseInt('12.34') === 12 && parseFloat('123.45#') === 123.45 && Number.parseInt('12.34') === 12 && Number.parseFloat('123.45#') === 123.45 )
	{
		my_console_log('parseInt/parseFloat success')
	}
	else
	{
		my_console_error('parseInt/parseFloat error')
	}

	if (Number.isInteger(25) && Number.isInteger(25.0) && !Number.isInteger(25.1) && !Number.isInteger("15") && !Number.isInteger("true"))
	{
		my_console_log('isInteger success')
	}
	else
	{
		my_console_error('isInteger error')
	}
	
	if (Number.EPSILON === 2.220446049250313e-16 && Number.EPSILON.toFixed(20) === 0.00000000000000022204)
	{
		my_console_log('Number.EPSILON success')
	}
	else
	{
		my_console_log('Number.EPSILON error')
	}

	if (Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1 && !Number.isSafeInteger('a') && Number.isSafeInteger(9007199254740990) && !Number.isSafeInteger(9007199254740992))
	{
		my_console_log('Number.MAX_SAFE_INTEGER success')
	}
	else
	{
		my_console_error('Number.MAX_SAFE_INTEGER error')
	}

	if (Math.trunc(4.1) === 4 
		&& Math.trunc('123.456') === 123
		&& Math.sign(-5) === -1
		&& Math.cbrt(-1) === -1
		&& Math.clz32(0) === 32
		&& Math.imul(2, 4) === 8
		&& Math.fround(0) ===0
		&& Math.hypot(3, 4) === 5
		&& Math.expm1(-1) === -0.6321205588285577
		&& Math.log1p(1)  === 0.6931471805599453
		&& Math.log10(2) === 0.3010299956639812
		&& Math.log2(3) === 1.584962500721156
		&& Math.sinh(1) === 1.1752011936438014
		&& Math.cosh(1) === 1.5430806348152437
		&& Math.tanh(1) === 0.7615941559557649
		&& Math.asinh(1) === 0.881373587019543
		&& Math.acosh(1) === 0
		&& Math.atanh(1) === Infinity
		&& Math.sign(0) === 0)
	{
		my_console_log('Other Math function succsee')
	}
	else
	{
		my_console_error('Other Math function error')
	}

	let index_a = 4;
	index_a **= 3;
	if (index_a === 64)
	{
		my_console_log('exponent arithmetic success')
	}
	else
	{
		my_console_log('exponent arithmetic error')
	}
}

/**
 * Array test
 */
function array_test()
{
	let tmp = [];
	let arrayLike = {
		'0': 'a',
		'1': 'b',
		'2': 'c',
		length: 3
	};
	let arr_form = Array.from(arrayLike)
	let arr_from2 = Array.from([1, 2, 3], (x) => x * x)
	if (Array.isArray(arr_form) && arr_form[0] === 'a' && Array.isArray(arr_from2) && arr_from2[2] === 9)
	{
		my_console_log('Array.from success')
	}
	else
	{
		my_console_error('Array.from error')
	}

	if (Array.isArray(Array.of(3)) && Array.of(3)[0]  === 3)
	{
		my_console_log('Array.of success')
	}
	else
	{
		my_console_error('Array.of error')
	}

	if (Array.isArray([1, 2, 3, 4, 5].copyWithin(0, 3)) && [1, 2, 3, 4, 5].copyWithin(0, 3)[0] === 4) // 会改变原数组
	{
		my_console_log('copyWithin success')
	}
	else
	{
		my_console_error('copyWithin error')
	}

	if ([1, 4, -5, 10].find((n) => n < 0) === -5 && [1, 4, -5, 10].findIndex((n) => n < 0) === 2)
	{
		my_console_log('Array find/findIndex success')
	}
	else
	{
		my_console_error('Array find/findIndex error')
	}

	if (['a', 'b', 'c'].fill(7, 1, 2)[1] === 7)
	{
		my_console_log('Array.fill success')
	}
	else
	{
		my_console_error('Array.fill error')
	}

	tmp = []
	for (let index of ['a', 'b'].keys()) 
	{
		tmp.push(index)
	}
	for (let elem of ['a', 'b'].values())
	{
		tmp.push(elem)
	}
	for (let [index, elem] of ['a', 'b'].entries())
	{
		tmp.push([index, elem])
	}
	if (tmp[0] === 0 && tmp[1] === 1 && tmp[2] === 'a' && tmp[3] === 'b' && tmp[4][0] === 0 && tmp[4][1] === 'a')
	{
		my_console_log('Array.keys/values/entries success')
	}
	else
	{
		my_console_error('Array.keys/values/entries error')
	}

	//es7
	if ([1, 2, 3].includes(2) && ![1, 2, 3].includes(4))
	{
		my_console_log('Array.includes success')
	}
	else
	{
		my_console_error('Array.includes error')
	}

	//扩展运算符（...）也会将空位转为undefined
	let array_vacancy = Array(3)
	if (array_vacancy.length === 3 
		&& Array.from(array_vacancy)[0] === undefined 
		&& [...array_vacancy][0] === undefined
		&& Array(3).fill('a').length === 3
		&& Array(3).fill('a')[0] === 'a')
	{
		my_console_log('Array vacancy test success')
	}
	else
	{
		my_console_error('Array vacancy test error')
	}

	//for...of并没有忽略空位
	tmp = []
	for (let i of Array(3))
	{
		tmp.push(i)
	}
	if (tmp.length === 3)
	{
		my_console_log('Array vacancy for...of test success')
	}
	else
	{
		my_console_error('Array vacancy for...if test error')
	}

	// // map方法遍历，空位是会跳过的
	// tmp = []
	// Array(3).map(() =>
	// {
	// 	tmp.push(true)
	// 	return true
	// })
	// if (tmp.length === 0)
	// {
	// 	my_console_log('Array vacancy map test success')
	// }
	// else
	// {
	// 	my_console_error('Array vacancy map test error')
	// }

	// // forEach方法遍历，空位是会跳过的
	// tmp = []
	// Array(3).forEach(() =>
	// {
	// 	tmp.push(true)
	// })
	// if (tmp.length === 0)
	// {
	// 	my_console_log('Array vacancy forEach test success')
	// }
	// else
	// {
	// 	my_console_error('Array vacancy forEach test error')
	// }

	// map方法遍历, 空位跳过, undefine是不会跳过的
	tmp = [, undefined, undefined].map(() =>
	{
		return true
	})
	if (tmp.length === 3 && !tmp[0])
	{
		my_console_log('Array vacancy,undefine map test success')
	}
	else
	{
		my_console_error('Array vacancy,undefine map test error')
	}

	// forEach方法遍历，空位跳过, undefine是不会跳过的
	tmp = [];
	[, undefined, undefined].forEach(() =>
	{
		tmp.push(true)
	})
	if (tmp.length === 2)
	{
		my_console_log('Array vacancy,undefine forEach test success')
	}
	else
	{
		my_console_error('Array vacancy,undefine forEach test error')
	}

	//entries()、keys()、values()、find()和findIndex()会将空位处理成undefined
	tmp = []
	for (let index of [,'a'].keys()) 
	{
		tmp.push(index)
	}
	for (let elem of [,'a'].values())
	{
		tmp.push(elem)
	}
	for (let [index, elem] of [,'a'].entries())
	{
		tmp.push([index, elem])
	}
	if (tmp[0] === 0 && tmp[1] === 1 && tmp[2] === undefined && tmp[3] === 'a' && tmp[4][0] === 0 && tmp[4][1] === undefined)
	{
		my_console_log('Array.keys/values/entries vacancy success')
	}
	else
	{
		my_console_error('Array.keys/values/entries vacancy error')
	}

	if ([,'a'].find(x => true) === undefined && [,'a'].findIndex(x => true) === 0)
	{
		my_console_log('Array.find/findIndex vacancy success')
	}
	else
	{
		my_console_error('Array.find/findIndex vacancy error')
	}

}


let foo_x = 99;
function foo(p = foo_x + 1) 
{
	return p;
}

var function_x = 1;
function fun_scope(function_x, function_y = function_x)
{
	return function_y
}

function fun_scope2(function_y = function_x)
{
	let function_x = 2;
	return function_y;
}

function fun_scope3(func = x => function_x)
{
	let function_x = 2;
	return func()
}

function add(...values)
{
	let sum = 0;
	for (var val of values) 
	{
		sum += val;
	}
  
	return sum;
}

function add2()
{
	let sum = 0;
	for (var val of arguments) 
	{
		sum += val;
	}
  
	return sum;
}

function add3(x, y, z)
{ 
	return x + y + z;
}

function clownsEverywhere(param1,param2,)
{
	return 'success'
}


// 如果传入undefined，将触发该参数等于默认值，null则没有这个效果。
function function_test(u = 1, n = 2, { a = 1, b }, {x, y = 'World', z = 0} = { z: 1 })
{
	if (x === undefined && y === 'World' && z === 1 && a === 1 && b === 2 && u === 1 && n === null)
	{
		my_console_log('function set default value success')
	}
	else
	{
		my_console_error('function set default value error')
	}

	if (foo() === 100)
	{
		foo_x = 100;
		if (foo() === 101)
		{
			my_console_log('function set default2 value success')
		}
		else
		{
			my_console_error('function set default2 value error')
		}
	}
	else
	{
		my_console_error('function set default2 value error')
	}

	// 指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数
	// length属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。同理，rest参数也不会计入length属性
	// 如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了。
	if ((function (a) {}).length === 1
		&& (function (a = 5) {}).length === 0
		&& (function (a, b, c = 5) {}).length === 2
		&& (function(...args) {}).length === 0
		&& (function (a = 0, b, c) {}).length === 0
		&& (function (a, b = 1, c) {}).length === 1)
	{
		my_console_log('function length test success')
	}
	else
	{
		my_console_error('function length test error')
	}

	// fun_scope will change function_x
	if (fun_scope(2) === 2 && fun_scope2() === 1 && fun_scope3() === 2)
	{
		my_console_log('function scope test success')
	}
	else
	{
		my_console_error('function scope test error')
	}

	/**
	 * Extension operator
	 */
	let args = [2, 5, 3];
	if (add(2, 5, 3) === 10 && add2(2, 5, 3) === 10 && add3(...args) === 10)
	{
		my_console_log('function rest params success')
	}
	else
	{
		my_console_error('function rest params error')
	}

	var arr1 = ['a', 'b'];
	var arr2 = ['c'];
	var arr3 = ['d', 'e'];
	if ([...arr1, ...arr2, ...arr3].length === 5 && [...'hello'].length === 5)
	{
		my_console_log('Extension operator success')
	}
	else
	{
		my_console_error('Extension operator error')
	}

	const add4 = add

	if (add.name === 'add' && add4.name === 'add')
	{
		my_console_log('function name success')
	}
	else
	{
		my_console_error('functoin name error')
	}

	//ES2017 允许函数的最后一个参数有尾逗号（trailing comma）
	if (clownsEverywhere('foo','bar',) === 'success')
	{
		my_console_log('function trailing comma success')
	}
	else
	{
		my_console_error('function trailing comma error')
	}

}

function Timer()
{
	this.s1 = 0;
	this.s2 = 0;
	// 箭头函数
	setTimeout(() => this.s1++, 100);
	// 普通函数
	setTimeout(function ()
	{
		this.s2++;
	}, 100);
}

function arrow_function_test()
{
	var f = (item) => 5 + item;
	if (f(5) === 10)
	{
		my_console_log('arrow function success')
	}
	else
	{
		my_console_error('arrow function error')
	}

	var timer = new Timer();
	setTimeout(() =>
	{
		if (timer.s1 === 1 && timer.s2 === 0)
		{
			my_console_log('arrow function this test success')
		}
		else
		{
			my_console_error('arrow function this test error')
		}
	}, 1000)
}

function tailFactorial(n, total)
{
	if (n === 1) return total;
	return tailFactorial(n - 1, n * total);
}
  
function factorial(n)
{
	return tailFactorial(n, 1);
}
  

function tail_recursion_test()
{
	if (factorial(5) === 120)
	{
		my_console_log('tail factorial success')
	}
	else
	{
		my_console_error('tail factorial error')
	}
}

//如果对象的方法使用了取值函数（getter）和存值函数（setter），则name属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上get和set。
var o = {
	get foo()
	{},
	set foo(x)
	{},
	hello() 
	{
		return "Hello!";
	},
	['h' + 'i']()
	{
		return 'hi';
	},
};

var doSomething = function()
{
// ...
};

function object_test(x, y)
{
	let tmp = [];
	var foo = 'bar';
	var baz = {foo};
	var params = {x, y}
	let propKey = 'foo'; //ES6 允许字面量定义对象时,允许把表达式放在方括号内。
	let obj = {
		[propKey]: true,
		['a' + 'bc']: 123
	};
	const keyA = {a: 1};
	const keyB = {b: 2};
	const keyC = Symbol('description')

	const myObject = 
	{
		[keyA]: 'valueA',
		[keyB]: 'valueB',
	};
	// //如果对象的方法是一个 Symbol 值，那么name属性返回的是这个 Symbol 值的描述。
	// const key1 = Symbol('description');
	// const key2 = Symbol();
	// let symbolObj = {
	// 	[key1]() {},
	// 	[key2]() {},
	// };
	// symbolObj[key1].name // "[description]"
	// symbolObj[key2].name // ""
	// my_console_log('pp',symbolObj[key1].name)
	const descriptor = Object.getOwnPropertyDescriptor(o, 'foo');
	if (baz.foo === 'bar'
		&& params.x === 1
		&& params.y === 2
		&& o.hello() === 'Hello!'
		&& o.hi() === 'hi'
		&& o.hello.name === 'hello'
		&& obj.foo === true
		&& obj.abc === 123
		&& myObject['[object Object]'] === 'valueB'
		&& descriptor.get.name === "get foo"
		&& descriptor.set.name === "set foo"
		&& (new Function()).name === "anonymous" //Function构造函数创造的函数，name属性返回anonymous
		&& doSomething.bind().name === "bound doSomething") //bind方法创造的函数，name属性返回bound加上原函数的名字
	{
		my_console_log('object test success')
	}
	else
	{
		my_console_log('object test error')
	}

	if (Object.is('foo', 'foo') && !Object.is({}, {}))
	{
		my_console_log('Object is test success')
	}
	else
	{
		my_console_error('Object is test error')
	}

	var target = { a: 1 };
	var source1 = { b: 2 };
	var source2 = { c: 3 };
	var dest = Object.assign(target, source1, source2)
	if (Object.assign(obj) === obj 
		&& typeof Object.assign(2) === 'object' && dest.a === 1
		&& Object.assign(obj, undefined) === obj
		&& Object.assign(obj, null) === obj
		&& !Object.getOwnPropertyDescriptor(class {foo() {}}.prototype, 'foo').enumerable //ES6规定，所有Class的原型的方法都是不可枚举的。
		&& Object.assign([1, 2, 3], [4, 5])[0] === 4)
	{
		my_console_log('Object assign success')
	}
	else
	{
		my_console_error('Object assign error')
	}

	var loopObject = { a: 1, b: 2, c: Symbol('3'), [Symbol('d')]: 'localSymbol'}
	loopObject[Symbol.for('e')] = 'globalSymbol';
	// 循环遍历对象自身的和继承的可枚举属性
	tmp = []
	for (let v in loopObject)
	{
		tmp.push(v)
	}
	if (tmp.length === 3 && tmp[0] === 'a' && tmp[1] === 'b' && tmp[2] === 'c')
	{
		my_console_log('Object for...in success')
	}
	else
	{
		my_console_error('Object for...in error')
	}
	if (Object.getOwnPropertyNames(loopObject).length === 3 && Object.getOwnPropertySymbols(loopObject).length === 2 && Reflect.ownKeys(loopObject).length === 5)
	{
		my_console_log('Object.getOwnPropertyNames/getOwnPropertySymbols/ownKeys test success')
	}
	else
	{
		my_console_error('Object.getOwnPropertyNames/getOwnPropertySymbols/ownKeys test error')
	}
}

function proto_test()
{
	let obj = {
		method: () => true,
		a: 'a'
	};
	obj.__proto__ = { a: 0, b: 1 };
	if (obj.a === 'a' && obj.b === 1 && Object.getPrototypeOf(obj).a === 0)
	{
		my_console_log('Objecr __proto__ test success')
	}
	else
	{
		my_console_error('Objecr __proto__ test error')
	}
	let objCreate = Object.create({a: 1}, {c: {value: 2, enumerable: true}})
	if (objCreate.a === 1 && objCreate.c === 2 && Object.getPrototypeOf(objCreate).a === 1 && Object.getPrototypeOf(objCreate).c === undefined)
	{
		my_console_log('Object create success')
	}
	else
	{
		my_console_error('Object create error')
	}
	Object.setPrototypeOf(obj, {c: 2})
	Object.defineProperty(obj, 'e', {
		value: 4,
		enumerable: false
	});
	if (Object.getPrototypeOf(obj).a === undefined
		&& Object.getPrototypeOf(obj).c === 2
		&& Object.getPrototypeOf(1) === Number.prototype //如果参数不是对象，会被自动转为对象。
		&& Object.getPrototypeOf('foo') === String.prototype
		&& Object.getPrototypeOf(true) === Boolean.prototype)
	{
		my_console_log('Object setPrototypeOf/getPrototypeOf success')
	}
	else
	{
		my_console_error('Object setPrototypeOf/getPrototypeOf error')
	}

	// Object.keys方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名
	// Object.values方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。
	// Object.entries方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。
	let {keys, values, entries} = Object;
	if (keys(obj).length === 2, values(obj).length === 2, entries(obj).length ===2)
	{
		my_console_log('Object keys/values/entries success')
	}
	else
	{
		my_console_error('Object keys/values/entries error')
	}
}

function object_extension_operator()
{
	let { x, ...y } = { x: 1, a: 2, b: 3 };
	let n = { ...y };
	if (x === 1 && y.a === 2 && y.b === 3 && n.a === 2 && n.b === 3)
	{
		my_console_log('Object deconstruction success')
	}
	else
	{
		my_console_error('Object deconstruction error')
	}

	let obj = {
		foo: 123,
		get bar() 
		{
			return 'abc' 
		}
	};
	let objDesc = Object.getOwnPropertyDescriptors(obj)
	if (obj.foo.enumerable === undefined && objDesc.foo.enumerable)
	{
		my_console_log('Object.getOwnPropertyDescriptors success')
	}
	else
	{
		my_console_error('Object.getOwnPropertyDescriptors error')
	}
}

// function null_conduction_operation()
// {
// 	const message = {
// 		body: {
// 			user: 'zhangyucheng'
// 		}
// 	}
// 	const firstName = message?.body?.user?.firstName || 'default';
// 	my_console_log(firstName)
// }

class MyClass
{
	[Symbol.hasInstance](foo)
	{
		return foo instanceof Array;
	}
}

class MyArray extends Array 
{
	static get [Symbol.species]()
	{ 
		return Array; 
	}
}

class MySearch 
{
	constructor(value) 
	{
		this.value = value;
	}
	[Symbol.search](string) 
	{
		return string.indexOf(this.value);
	}
}

class MyMatcher
{
	[Symbol.match](string)
	{
		return 'hello world'.indexOf(string);
	}
}

class MySplitter 
{
	constructor(value) 
	{
		this.value = value;
	}
	[Symbol.split](string)
	{
		var index = string.indexOf(this.value);
		if (index === -1) 
		{
			return string;
		}
		return [
			string.substr(0, index),
			string.substr(index + this.value.length)
		];
	}
}

function symbol_test()
{
	var s1 = Symbol('foo');
	var s2 = Symbol('foo');
	var s3 = Symbol.for('foo');
	var s4 = Symbol.for('foo');
	var obj = {};
	obj.s1 = 'Hello!';//Symbol值作为对象属性名时，不能用点运算符。

	if (s1 !== s2
		&& String(s1) === 'Symbol(foo)'
		&& Boolean(s1)
		&& obj[s1] === undefined
		&& obj['s1'] === 'Hello!'
		&& s1 !== s3
		&& s3 === s4
		&& Symbol.keyFor(s1) === undefined
		&& Symbol.keyFor(s3) === 'foo')
	{
		my_console_log('symbol test success')
	}
	else
	{
		my_console_error('symbol test error')
	}

	if ([1, 2, 3] instanceof new MyClass())
	{
		my_console_log('Symbol.hasInstance test success')
	}
	else
	{
		my_console_error('Symbol.hasInstance test error')
	}

	let arr = ['c', 'd'];
	let isConcatSpreadableTrue = ['a', 'b'].concat(arr, 'e').length
	arr[Symbol.isConcatSpreadable] = false;
	let isConcatSpreadableFalse = ['a', 'b'].concat(arr, 'e').length
	if (isConcatSpreadableTrue === 5 && isConcatSpreadableFalse === 4)
	{
		my_console_log('Symbol.isConcatSpreadable test success')
	}
	else
	{
		my_console_error('Symbol.isConcatSpreadable test error')
	}

	var a = new MyArray(1,2,3);
	var mapped = a.map(x => x * x);
	if (!(mapped instanceof MyArray) && (mapped instanceof Array))
	{
		my_console_log('Symbol.species test success')
	}
	else
	{
		my_console_error('Symbol.species test error')
	}

	if ('e'.match(new MyMatcher()) === 1 && 'foobar'.search(new MySearch('foo')) === 0)
	{
		my_console_log('Symbol.match/search test success')
	}
	else
	{
		my_console_error('Symbol.match/search test error')
	}

	let x = {};
	let replace = []
	x[Symbol.replace] = (...s) => replace=s;

	'Hello'.replace(x, 'World')
	if (replace[0] === 'Hello' && replace[1] === 'World')
	{
		my_console_log('Symbol.replace test success')
	}
	else
	{
		my_console_error('Symbol.replace test error')
	}

	let split = 'foobar'.split(new MySplitter('foo'))
	if (split[0] === '' && split[1] === 'bar' )
	{
		my_console_log('Symbol.split test success')
	}
	else
	{
		my_console_error('Symbol.split test error')
	}

	var myIterable = {};
	myIterable[Symbol.iterator] = function* () {
		yield 1;
		yield 2;
		yield 3;
	};

	if ([...myIterable].length === 3 && [...myIterable][0] === 1)
	{
		my_console_log('Symbol.iterator test success')
	}
	else
	{
		my_console_error('Symbol.iterator test error')
	}

	let objToPrimitive = {
		[Symbol.toPrimitive](hint)
		{
			switch (hint) 
			{
				case 'number':
					return 123;
				case 'string':
					return 'str';
				case 'default':
					return 'default';
				default:
					throw new Error();
			}
		}
	};

	if (2 * objToPrimitive === 246 && 3 + objToPrimitive  === '3default' && objToPrimitive == 'default' && String(objToPrimitive) === 'str')
	{
		my_console_log('Symbol.toPrimitive test success')
	}
	else
	{
		my_console_error('Symbol.toPrimitive test error')
	}

	if (({[Symbol.toStringTag]: 'Foo'}.toString()) === "[object Foo]"
		&& JSON[Symbol.toStringTag] ==='JSON'
		&& Math[Symbol.toStringTag] === 'Math'
		// && Module[Symbol.toStringTag] === 'Module'
		&& ArrayBuffer.prototype[Symbol.toStringTag] === 'ArrayBuffer'
		&& DataView.prototype[Symbol.toStringTag] === 'DataView'
		&& Map.prototype[Symbol.toStringTag] === 'Map'
		&& Promise.prototype[Symbol.toStringTag] === 'Promise'
		&& Set.prototype[Symbol.toStringTag] === 'Set'
		// && %TypedArray%.prototype[Symbol.toStringTag] === 'Uint8Array'
		&& WeakMap.prototype[Symbol.toStringTag] === 'WeakMap'
		&& WeakSet.prototype[Symbol.toStringTag] === 'WeakSet'
		// && %MapIteratorPrototype%[Symbol.toStringTag] === 'Map Iterator'
		// && %SetIteratorPrototype%[Symbol.toStringTag] === 'Set Iterator'
		// && %StringIteratorPrototype%[Symbol.toStringTag] === 'String Iterator'
		&& Symbol.prototype[Symbol.toStringTag] === 'Symbol'
		// && Generate.prototype[Symbol.toStringTag] === 'Generator'
		// && GeneratorFunction.prototype[Symbol.toStringTag] === 'GeneratorFunction')
	)
	{
		my_console_log('Symbol.toStringTag test success')
	}
	else
	{
		my_console_error('Symbol.toStringTag test error')
	}

	my_console_log(Uint8Array.prototype[Symbol.toStringTag] === 'Uint8Array')

	let unscopables = Object.keys(Array.prototype[Symbol.unscopables])
	if (unscopables.length
		&& unscopables[0] === 'copyWithin'
		&& unscopables[1] === 'entries'
		&& unscopables[2] === 'fill'
		&& unscopables[3] === 'find'
		&& unscopables[4] === 'findIndex'
		&& unscopables[5] === 'includes'
		&& unscopables[6] === 'keys')
	{
		my_console_log('Symbol.unscopables test success')
	}
	else
	{
		my_console_error('Symbol.unscopables test error')
	}
}

function set_test()
{
	var set = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
	if ([...set].length === 5 && set.size === 5)
	{
		my_console_log('Set test success')
	}
	else
	{
		my_console_error('Set test error')
	}

	set.add({});
	let size1 = set.size
	set.add({});
	let size2 = set.size
	set.delete(2);
	var set1 = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
	set1.clear()
	if (size2 - size1 === 1 && set.has(1) && !set.has(2) && set1.size === 0)
	{
		my_console_log('Set.add/has/delete/clean test success')
	}
	else
	{
		my_console_error('Set.add/has/delete/clean test error')
	}

	set = new Set(['red', 'green', 'blue']);
	let keys = [];
	let values = [];
	let entires = [];
	let forEach = [];
	let arr = [];
	for (let item of set.keys())
	{
		keys.push(item)
	}
	
	for (let item of set.values())
	{
		values.push(item)
	}
	
	for (let item of set.entries())
	{
		entires.push(item)
	}

	set.forEach(item =>
	{
		forEach.push(item)
	})

	for (let item of set) 
	{
		arr.push(item)
	}
	
	if (keys.length === 3 && values.length === 3 && entires.length === 3 && arr.length === 3)
	{
		my_console_log('Set.values/entires/keys/forEach test success')
	}
	else
	{
		my_console_error('Set.values/entires/keys/forEach test error')
	}
}

// WeakSet的成员只能是对象
// WeakSet中的对象都是弱引用
// WeakSet是不可遍历的
function weak_set_test()
{
	let ws = new WeakSet();
	let obj = {};
	let foo = {};

	ws.add(window);
	ws.add(obj);
	ws.add(foo);
	ws.delete(foo);

	if (ws.has(window) && ws.has(obj) && !ws.has(foo))
	{
		my_console_log('WeakSet.add/has/delete test success')
	}
	else
	{
		my_console_error('WeakSet.add/has/delete test error')
	}
}

function map_test()
{
	var m = new Map([['name', '张三'], ['title', 'Author']]);
	var m1 = new Map([['name', '张三'], ['title', 'Author']]);
	var o = {p: 'Hello World'};

	m.set(o, 'content')
	m.delete('name')
	m1.clear()

	if (m.get(o) === "content" && m.has(o) && m.size === 2 && !m.has('name') && m.has('title') && m1.size === 0)
	{
		my_console_log('Map.set/get/has/delete/clear test success')
	}
	else
	{
		my_console_error('Map.set/get/has/delete/clear test error')
	}

	m = new Map([['F', 'no'], ['T',  'yes']]);
	let keys = [];
	let values = [];
	let entires = [];
	let forEach = [];
	let arr = [];
	for (let item of m.keys())
	{
		keys.push(item)
	}
	
	for (let item of m.values())
	{
		values.push(item)
	}
	
	for (let item of m.entries())
	{
		entires.push(item)
	}

	m.forEach(item =>
	{
		forEach.push(item)
	})

	for (let item of m) 
	{
		arr.push(item)
	}
	
	if (keys.length === 2 && values.length === 2 && entires.length === 2 && arr.length === 2)
	{
		my_console_log('Map.values/entires/keys/forEach test success')
	}
	else
	{
		my_console_error('Map.values/entires/keys/forEach test error')
	}

}

// 只接受对象作为键名（null除外）
function weak_map_test()
{
	var m = new WeakMap();
	var o = {p: 'Hello World'};

	m.set(o, 'content')
	m.delete('name')
	if (m.get(o) === "content" && m.has(o))
	{
		my_console_log('WeakMap.set/get/has/delete test success')
	}
	else
	{
		my_console_error('WeakMap.set/get/has/delete test error')
	}
}

function proxyObj (left, right)
{
	this.left = left;
	this.right = right;
	return this
}

function proxy_reflect_test()
{
	var proxy = new Proxy(proxyObj, {
		get: function(target, prop)
		{
			if (prop === 'get')
			{
				return 'myGet'
			}
			else
			{
				return Reflect.get(target, prop);
			}
		},
		set: function(target, prop, value)
		{
			if (prop === 'set')
			{
				return Reflect.set(target, prop, 'mySet');
			}
			else
			{
				return Reflect.set(target, prop, value);
			}
		},
		apply (target, ctx, args)
		{
			return Reflect.apply(target, proxy, args);
		},
		has (target, key)
		{
			if (key[0] === '_')
			{
				return false;
			}
			return Reflect.has(...arguments);
		},
		construct: function(target, args)
		{
			return Reflect.construct(target, args);
		},
		deleteProperty: function(target, key)
		{
			return Reflect.deleteProperty(target, key)
		},
		defineProperty (target, key, descriptor)
		{
			return Reflect.defineProperty(target, key, descriptor);
		},
		getOwnPropertyDescriptor (target, key)
		{
			if (key[0] === '_')
			{
				return;
			}
			return Reflect.getOwnPropertyDescriptor(target, key);
			// return Object.getOwnPropertyDescriptor(target, key);
		},
		getPrototypeOf (target)
		{
			return Reflect.getPrototypeOf(target)
			// return Reflect.getPrototypeOf(new Object().__proto__) //new Object().__proto__ === null
		},
		isExtensible (target)
		{
			return Reflect.isExtensible(target)
		},
		ownKeys(target)
		{
			return Reflect.ownKeys(target)
		},
		setPrototypeOf(target, proto)
		{
			return Reflect.setPrototypeOf(target, proto);
		}
	});


	proxy.time = 35
	proxy.set = '123'
	Object.defineProperty(proxy, 'define', {value: 'define'})
	Object.setPrototypeOf(proxy, null)
	if (proxy.time === 35
		&& proxy.get === 'myGet'
		&& proxy.set === 'mySet'
		&& proxy(1, 2).left === 1
		&& proxy(1, 2).right === 2
		&& !('_time' in proxy)
		&& ('time' in proxy)
		&& (new proxy(3, 4)).left === 3
		&& proxy.define === 'define'
		&& !Object.getOwnPropertyDescriptor(proxy, '_time')
		&& Object.getOwnPropertyDescriptor(proxy, 'time').value === 35
		&& Object.getPrototypeOf(proxy) === null
		&& Object.isExtensible(proxy)
		&& Object.keys(proxy)[0] === 'time')
	{
		my_console_log('Proxy/Reflect get/set/apply/has/construct/deleteProperty/defineProperty/getOwnPropertyDescriptor/getPrototypeOf test success')
	}
	else
	{
		my_console_error('Proxy/Reflect get/set/apply/has/construct test error')
	}
	delete proxy.time
	if (proxy.time === undefined)
	{
		my_console_log('Proxy/Reflect delete test success')
	}
	else
	{
		my_console_error('Proxy/Reflect delete test error')
	}

	const target = 
	{
		m: function () 
		{
			return (this === proxyPreventExtensions);
		}
	};
	var proxyPreventExtensions = new Proxy(target, {
		isExtensible (target)
		{
			return false
		},
		//这个方法有一个限制，只有目标对象不可扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true，否则会报错。
		preventExtensions(target)
		{
			return Reflect.preventExtensions(target)
		}
	});
	if (Object.preventExtensions(proxyPreventExtensions))
	{
		my_console_log('Proxy/Reflect preventExtensions test success')
	}
	else
	{
		my_console_error('Proxy/Reflect preventExtensions test error')
	}

	if (!target.m() && proxyPreventExtensions.m())
	{
		my_console_log('Proxy this test success')
	}
	else
	{
		my_console_error('Proxy this test error')
	}

	let {proxy: proxyRevocable, revoke} = Proxy.revocable({}, {});
	proxyRevocable.time = 35
	revoke();
	// my_console_log(proxyRevocable)
}

function iterator_test()
{
	let tmp = []
	//在ES6中，有三类数据结构原生具备Iterator接口：数组、某些类似数组的对象、Set和Map结构。
	let arr = ['a', 'b'];
	let iter = arr[Symbol.iterator]();

	tmp.push(iter.next()) // { value: 'a', done: false }
	tmp.push(iter.next()) // { value: 'b', done: false }
	tmp.push(iter.next()) // { value: undefined, done: true }
	if (tmp[0].value === 'a' && tmp[1].value === 'b' && tmp[2].value === undefined && tmp[2].done)
	{
		my_console_log('arr iterator test success')
	}
	else
	{
		my_console_error('arr iterator test error')
	}

	// 为对象添加Iterator接口的例子
	let obj = {
		data: [ 'hello', 'world' ],
		[Symbol.iterator]() 
		{
			const self = this;
			let index = 0;
			return {
				next() 
				{
					if (index < self.data.length) 
					{
						return {
							value: self.data[index++],
							done: false
						};
					} 
					else 
					{
						return { value: undefined, done: true };
					}
				}
			};
		}
	};
	tmp = []
	for (let o of obj)
	{
		tmp.push(o)
	}
	if (tmp.length === 2 && tmp[0] === 'hello' && tmp[1] === 'world')
	{
		my_console_log('object iterator test success')
	}
	else
	{
		my_console_error('object iterator test error')
	}

	
	// 类似数组的对象调用数组的Symbol.iterator方法的例子。
	let iterable_sob = {
		0: 'a',
		1: 'b',
		2: 'c',
		length: 3,
		[Symbol.iterator]: Array.prototype[Symbol.iterator]
	};
	tmp = []
	for (let item of iterable_sob)
	{
		tmp.push(item); // 'a', 'b', 'c'
	}
	if (tmp.length === 3 && tmp[0] === 'a' && tmp[1] === 'b')
	{
		my_console_log('Similar array object use Array iterator test success')
	}
	else
	{
		my_console_error('Similar array object use Array iterator test error')
	}

	// 普通对象部署数组的Symbol.iterator方法，并无效果。
	let iterable_nob = {
		a: 'a',
		b: 'b',
		c: 'c',
		length: 3,
		[Symbol.iterator]: Array.prototype[Symbol.iterator]
	};
	tmp = []
	for (let item of iterable_nob) 
	{
		tmp.push(item); // undefined, undefined, undefined
	}
	if (tmp.length === 3 && tmp[0] === undefined && tmp[1] === undefined)
	{
		my_console_log('normal object use Array iterator test success')
	}
	else
	{
		my_console_error('normal object use Array iterator test error')
	}

	var myIterable = {};

	myIterable[Symbol.iterator] = function* ()
	{
		yield 1;
		yield 2;
		yield 3;
	};
	let yieldArr = [...myIterable] // [1, 2, 3]
	if (yieldArr.length === 3 && yieldArr[0] === 1 && yieldArr[1] === 2)
	{
		my_console_log('yield iterator test success')
	}
	else
	{
		my_console_error('yield iterator test error')
	}
}

function generatePromisesForAll(array)
{
	return array.map((item, index) =>
	{
		return new Promise((resolve, reject) =>
		{
			if (index <= 3)
			{
				resolve(item)
			}
			else
			{
				reject(item)
			}
		})
	})
}

function generatePromisesForRace(resolveTime, timeout)
{
	return [
		new Promise((resolve, reject) =>
		{
			setTimeout(() => resolve(), resolveTime)
		}),
		new Promise((resolve, reject) =>
		{
			setTimeout(() => reject(new Error('request timeout')), timeout)
		})
	]
}

function promise_test()
{
	new Promise((resolve, reject) =>
	{
		resolve();
	}).then(() =>
	{
		return Promise.resolve(1)
	}).then((v) =>
	{
		if (v === 1)
		{
			my_console_log('promise resolve test success')
		}
		else
		{
			my_console_error('promise resolve test error')
		}
		// throw new Error(2);
		return Promise.reject(2)
	}).catch((error) =>
	{
		if (error === 2)
		{
			my_console_log('promise reject test success')
		}
		else
		{
			my_console_error('promise reject test error')
		}
	});

	Promise.all(generatePromisesForAll([1,2,3])).then((item) =>
	{
		if (item.length === 3)
		{
			my_console_log('promise all resolve success')
		}
		else
		{
			my_console_error('promise all resolve error')
		}
	}).catch((reason) =>
	{
		my_console_error('promise all resolve error')
	});

	Promise.all(generatePromisesForAll([1,2,3,4,5,6])).then((item) =>
	{
		my_console_error('promise all reject error')
	}).catch((reason) =>
	{
		my_console_log('promise all reject success')
	});

	Promise.race(generatePromisesForRace(500, 1000)).then(() =>
	{
		my_console_log('Promise race resolve success')
	}).catch((reason) =>
	{
		my_console_error('Promise race resolve error')
	});

	Promise.race(generatePromisesForRace(1000, 500)).then(() =>
	{
		my_console_error('Promise race reject error')
	}).catch((reason) =>
	{
		my_console_log('Promise race reject success')
	});
}

function generator_test()
{
	function* f() 
	{
		for(var i = 0; true; i++)
		{
			try
			{
				var reset = yield i;
				if(reset) 
				{
					i = -1;
				}
			}
			catch(e)
			{
				if (e === 'a')
				{
					my_console_log('generator throw success')
				}
				else
				{
					my_console_error('generator throw error')
				}
				
			}
		}
	}
	
	var g = f();
	
	g.next() // { value: 0, done: false }
	if (g.next().value === 1)
	{
		my_console_log('generator next success')
	}
	else
	{
		my_console_error('generator next error')
	}
	if (g.next(true).value === 0)
	{
		my_console_log('generator next param  success')
	}
	else
	{
		my_console_error('generator next param error')
	}
	g.throw('a')
	// 遍历器对象g调用return方法后，返回值的value属性就是return方法的参数foo。并且，Generator函数的遍历就终止了，返回值的done属性为true，以后再调用next方法，done属性总是返回true
	if (g.return('g').value === 'g' && g.next().value === undefined)
	{
		my_console_log('generator return  success')
	}
	else
	{
		my_console_error('generator return error')
	}

	// 调用return方法后，就开始执行finally代码块，然后等到finally代码块执行完，再执行return方法。
	function* numbers ()
	{
		yield 1;
		try
		{
			yield 2;
			yield 3;
		}
		finally
		{
			yield 4;
			yield 5;
		}
		yield 6;
	}
	var g1 = numbers();
	if (g1.next().value === 1
		&& g1.next().value === 2
		&& g1.return(7).value === 4
		&& g1.next().value === 5
		&& g1.next().value === 7
		&& g1.next().value === undefined
	)
	{
		my_console_log('generator finally  success')
	}
	else
	{
		my_console_error('generator finally error')
	}

	let tmp = []
	let obj =
	{
		*foo()
		{
			yield 1;
			yield 2;
			yield 3;
			yield 4;
			yield 5;
			return 6;
		}
	}
	
	for (let v of obj.foo())
	{
		tmp.push(v)
	}
	if (tmp.length === 5 && tmp[0] === 1)
	{
		my_console_log('generator for...of... success')
	}
	else
	{
		my_console_error('generator for...of... error')
	}
}

function generatePromise(value, time, rejectFlag)
{
	return new Promise((reslove, reject) =>
	{
		setTimeout(() =>
		{
			if (!rejectFlag)
			{
				reslove(value)
			}
			else
			{
				reject(value)
			}
		}, time)
	})
}

async function async_function()
{
	var d1 = await generatePromise('a', 500);
	var d2 = await generatePromise('b', 500);
	return d1 + d2;
}

function async_test()
{
	async_function().then((result) =>
	{
		if (result === 'ab')
		{
			my_console_log('async test success')
		}
		else
		{
			my_console_error('async test error')
		}
	}).catch((error) =>
	{
		my_console_error('async catch error')
	})
}

class Point 
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
  
	toString()
	{
		return '(' + this.x + ', ' + this.y + ')';
	}
}

class ColorPoint extends Point
{
	constructor(x, y, color)
	{
		super(x, y); // 调用父类的constructor(x, y)
		this.color = color;
	}
  
	toString()
	{
		return this.color + ' ' + super.toString(); // 调用父类的toString()
	}
}

class CustomClass
{
	constructor(...args)
	{
		this.target = new.target === CustomClass
		this.args = args;
	}
	* [Symbol.iterator]() 
	{
		for (let arg of this.args) 
		{
			yield arg;
		}
	}
	get prop() 
	{
		return 'getter';
	}
	set prop(value) 
	{
		return 'setter: '+value
	}
}

function class_test()
{
	let tmp = []
	if (typeof Point === "function"
		&& Point.name === 'Point'
		&& Point === Point.prototype.constructor
		&& Object.keys(Point.prototype).length === 0 //toString方法是Point类内部定义的方法，它是不可枚举的。这一点与ES5的行为不一致。
		&& Object.getOwnPropertyNames(Point.prototype).length === 2)
	{
		my_console_log('Class test success')
	}
	else
	{
		my_console_error('Class test error')
	}
	
	var point = new Point(2, 3);
	if (point.hasOwnProperty('x')
		&& point.hasOwnProperty('y')
		&& !point.hasOwnProperty('toString')
		&& point.__proto__.hasOwnProperty('toString'))
	{
		my_console_log('Class instance test success')
	}
	else
	{
		my_console_error('Class instance test error')
	}

	//Class不存在变量提升（hoist），这一点与ES5完全不同。
	//因为Bar继承Foo的时候，Foo已经有定义了。但是，如果存在class的提升，下面代码就会报错，因为class会被提升到代码头部，而let命令是不提升的，所以导致Bar继承Foo的时候，Foo还没有定义。
	let Foo = class 
	{};
	class Bar extends Foo
	{
	}

	let cp = new ColorPoint(25, 8, 'green');
	if (cp instanceof ColorPoint
		&& cp instanceof Point
		&& ColorPoint.__proto__ === Point //子类的__proto__属性，表示构造函数的继承，总是指向父类。
		&& ColorPoint.prototype.__proto__ === Point.prototype) //子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
	{
		my_console_log('Class extends success')
	}
	else
	{
		my_console_error('Class extends error')
	}

	let inst = new CustomClass();
	inst.prop = 123;
	if (inst.prop === 'getter' && inst.target)
	{
		my_console_log('Class get/set/new_target success')
	}
	else
	{
		my_console_error('Class get/set/new_target error')
	}

	tmp = []
	for (let x of new CustomClass('hello', 'world'))
	{
		tmp.push(x)
	}
	if (tmp[0] === 'hello' && tmp[1] === 'world')
	{
		my_console_log('Class generator success')
	}
	else
	{
		my_console_error('Class generator error')
	}
}

function mix(...mixins)
{
	class Mix
	{

	}
	for (let mixin of mixins)
	{
		copyProperties(Mix, mixin);
		copyProperties(Mix.prototype, mixin.prototype);
	}
  
	return Mix;
}
  
function copyProperties(target, source)
{
	for (let key of Reflect.ownKeys(source))
	{
		if ( key !== "constructor"
		&& key !== "prototype"
		&& key !== "name"
		)
		{
			let desc = Object.getOwnPropertyDescriptor(source, key);
			Object.defineProperty(target, key, desc);
		}
	}
}

class Dog
{
	run()
	{
		return 'run'
	}
}

class Cat
{
	jump()
	{
		return 'jump'
	}
}

class Pet extends mix(Dog, Cat)
{
	constructor()
	{
		super()
	}
}

function mix_test()
{
	let pet = new Pet()
	if (pet.jump() === 'jump' && pet.run() === 'run')
	{
		my_console_log('Class mix success')
	}
	else
	{
		my_console_error('Class mix error')
	}

}

//es7
// class Person {
// 	@readonly
// 	name() { return `${this.first} ${this.last}` }
// }
// function testable(target)
// {
// 	target.isTestable = true;
// }
	
// @testable
// class MyTestableClass 
// {

// }  
// function decorator_test()
// {
	
// 	my_console_log(MyTestableClass.isTestable) // true
// }

function module_test()
{
	if (export_test.export1(1) === 1
		&& export1(2) === 2
		&& export_default(3) === 3)
	{
		my_console_log('module test success')
	}
	else
	{
		my_console_error('module test error')
	}
}

function binary_array_test()
{
	// ArrayBuffer对象代表储存二进制数据的一段内存，它不能直接读写
	var buffer = new ArrayBuffer(32);
	if (buffer.byteLength === 32)
	{
		my_console_log('ArrayBuffer create success')
	}
	else
	{
		my_console_error('ArrayBuffer create error')
	}
	var x1 = new Uint8Array(buffer);
	var x2 = new Uint8Array(buffer);
	x1[0]  = 2;
	var newBuffer = buffer.slice(0, 3); // 分配一段新内存
	var x3 = new Uint8Array(newBuffer);
	x1[0] = 1;
	if (x1[0] === 1 && x2[0] === 1 && x3[0] === 2)
	{
		my_console_log('ArrayBuffer slice success')
	}
	else
	{
		my_console_error('ArrayBuffer slice error')
	}
	if (!ArrayBuffer.isView(buffer) && ArrayBuffer.isView(x1))
	{
		my_console_log('ArrayBuffer isView success')
	}
	else
	{
		my_console_error('ArrayBuffer isView error')
	}

	let arr = [1,2,3]
	var typedArr = new Uint8Array(arr);
	arr[0] = 2;
	typedArr[0] = 3
	var normalArr = Array.prototype.slice.call(typedArr);// TypedArray数组也可以转换回普通数组。
	if (arr[0] === 2 && typedArr[0] === 3 && normalArr[0] === 3)
	{
		my_console_log('TypedArray to array interconversion success')
	}
	else
	{
		my_console_error('TypedArray to array interconversion error')
	}
	let tmp = [];
	for (let byte of typedArr)
	{
		tmp.push(byte)
	}
	if (tmp.length === 3 && tmp[0] === 3)
	{
		my_console_log('TypedArray for...of... success')
	}
	else
	{
		my_console_error('TypedArray for...of... error')
	}
	
	if (Int8Array.BYTES_PER_ELEMENT === 1
		&& Uint8ClampedArray.BYTES_PER_ELEMENT === 1
		&& Uint8Array.BYTES_PER_ELEMENT === 1
		&& Int16Array.BYTES_PER_ELEMENT === 2
		&& Uint16Array.BYTES_PER_ELEMENT === 2
		&& Int32Array.BYTES_PER_ELEMENT === 4
		&& Uint32Array.BYTES_PER_ELEMENT === 4
		&& Float32Array.BYTES_PER_ELEMENT === 4
		&& Float64Array.BYTES_PER_ELEMENT === 8)
	{
		my_console_log('TypedArray BYTES_PER_ELEMENT success')
	}
	else
	{
		my_console_error('TypedArray BYTES_PER_ELEMENT error')
	}

	var dataBuffer = new ArrayBuffer(24);
	var dv = new DataView(dataBuffer);
	// 在第1个字节，以大端字节序写入值为25的32位整数
	dv.setInt32(0, 25, false);
	// 在第5个字节，以大端字节序写入值为25的32位整数
	dv.setInt32(4, 25);
	// 在第9个字节，以小端字节序写入值为2.5的32位浮点数
	dv.setFloat32(8, 2.5, true);
	if (dv.getInt32(0, false) === 25 && dv.getInt32(0, false) !== dv.getInt32(0, true))
	{
		my_console_log('DataView success')
	}
	else
	{
		my_console_error('DataView error')
	}

}

export function test()
{
	my_console_log('start test')

	let_const_test()
	destructuring_test()
	string_test()
	regular_test() //
	number_test()
	array_test()
	function_test(undefined, null, {b: 2})
	arrow_function_test()
	tail_recursion_test()
	object_test(1, 2)
	proto_test()
	object_extension_operator()
	// null_conduction_operation()
	symbol_test()
	set_test()
	weak_set_test();
	map_test();
	weak_map_test();
	proxy_reflect_test()
	iterator_test()
	promise_test() //
	generator_test() //
	async_test() //
	class_test()
	mix_test()
	// decorator_test()
	module_test()
	binary_array_test()

	my_console_log('end test')
}
