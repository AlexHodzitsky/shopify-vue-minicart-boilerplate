function throttle(func, wait) {
	let args;
	let result;
	let thisArg;
	let timeoutId;
	let lastCalled = 0;

	function trailingCall() {
		lastCalled = new Date;
		timeoutId = null;
		result = func.apply(thisArg, args);
	}

	return function() {
		let now = new Date;
		lastCalled = lastCalled || new Date;
		let remain = wait - (now - lastCalled);

		args = arguments;
		thisArg = this;

		if (remain <= 0) {
			lastCalled = now;
			result = func.apply(thisArg, args);
		} else if (!timeoutId) {
			timeoutId = setTimeout(trailingCall, remain);
		}
		return result;
	};
}

export default throttle;
