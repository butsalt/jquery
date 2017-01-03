define( [
	"../core"
], function( jQuery ) {

"use strict";

// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
// 如果key上要设置value，raw必须设为true
// 否则value会被作为原始value的filter被调用
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		// 设置完毕后返回集合本身
		chainable = true;
		for ( i in key ) {
			// key是键值对对象，i是当前遍历到的key，key[i]是key对应的value
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		// value如果不是function，则只能作为值被设置
		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// key为空

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					// raw时，fn的scope用的elems应该是一个jquery对象
					// 为了保证bulk时函数签名相同，在非raw时fn的scope也应该是一个jquery对象
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					// 通过执行fn获取值
					// 通过执行value获取实际要设置的值
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	// set完毕，返回集合本身
	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	// 如果第一个元素则返回第一个元素属性为key的值否则返回emptyGet(默认值)
	return len ? fn( elems[ 0 ], key ) : emptyGet;
};

return access;

} );
