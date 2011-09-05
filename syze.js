/*! syze v1.1.1 MIT/GPL2 @rezitech */
(function (win, docEl) {
	// syze variables
	var
	_sizes = [],
	_names = {},
	_from = 'browser',
	_debounceRate = 50,
	_callback;
	// add window event
	function addWinEvent(type, fn) {
		if (win.addEventListener) addEventListener(type, fn, false); else attachEvent('on' + type, fn);
	}
	// debouncer
	function debounce(fn) {
		var timeout;
		return function () {
			var obj = this, args = arguments;
			function delayed () {
				fn.apply(obj, args);
				timeout = null;
			}
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(delayed, _debounceRate); 
		};
	}
	// resizer
	function onResize() {
		var
		currentSize = 
			/^device$/i.test(String(_from)) ? !win.orientation || orientation == 180 ? screen.width : screen.height
			: /^browser$/i.test(String(_from)) ? docEl.clientWidth
			: (_from instanceof String) ? Function('return ' + _from)()
			: parseInt(_from, 10) || 0,
		docElClassNames = docEl.className.replace(/^\s+|(^|\s)(gt|is|lt)[^\s]+|\s+$/g, '').split(/\s+/),
		classNames = [], i = -1, e, arr = _sizes, len = arr.length;
		//
		arr.sort(function (a, b) { return(a - b); });
		//
		while (++i < len) if (currentSize < arr[i]) break;
		currentSize = arr[Math.max(Math.min(--i, len - 1), 0)];
		//
		i = -1;
		while (++i < len) {
			classNames.push((currentSize > arr[i] ? 'gt' : currentSize < arr[i] ? 'lt' : 'is') + (_names[arr[i]] || arr[i]));
		}
		//
		docEl.className = (!docElClassNames[0] ? [] : docElClassNames).concat(classNames).join(' ');
		//
		if (_callback) _callback(currentSize);
	}
	// syze controls
	win.syze = {
		sizes: function (val) { _sizes = [].concat.apply([], arguments); onResize(); return this; },
		names: function (val) { if (val instanceof Object) { _names = val; onResize(); } return this; },
		from: function (val) { _from = val; onResize(); return this; },
		debounceRate: function (val) { _debounceRate = parseInt(val, 10) || 0; onResize(); return this; },
		callback: function (val) { if (val instanceof Function) { _callback = val; onResize(); } return this; }
	};
	// start syze
	addWinEvent('resize', debounce(onResize));
	addWinEvent('orientationchange', onResize);
	onResize();
}(this, document.documentElement));