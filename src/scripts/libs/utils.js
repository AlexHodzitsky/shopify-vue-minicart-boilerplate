/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

	/**
	 * Return an object from an array of objects that matches the provided key and value
	 *
	 * @param {array} array - Array of objects
	 * @param {string} key - Key to match the value against
	 * @param {string} value - Value to get match of
	 */
	findInstance(array, key, value) {
		return array.find(object => {
			return object[key] === value;
		}) || null;
	},

	/**
	 * Remove an object from an array of objects by matching the provided key and value
	 *
	 * @param {array} array - Array of objects
	 * @param {string} key - Key to match the value against
	 * @param {string} value - Value to get match of
	 */
	removeInstance (array, key, value) {
		array.some((object, index) => {
			if(object[key] === value) {
				array.splice(index, 1);
				return true;
			}
		});

		return array;
	},

	/**
	 * _.compact from lodash
	 * Remove empty/false items from array
	 *
	 * @param {array} array
	 */
	compact (array) {
		return array.filter(element => {
			return element || element === 0;
		});
	},

	/**
	 * _.defaultTo from lodash
	 * Checks `value` to determine whether a default value should be returned in
	 * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
	 * or `undefined`.
	 * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
	 *
	 * @param {*} value - Value to check
	 * @param {*} defaultValue - Default value
	 * @returns {*} - Returns the resolved value
	 */
	defaultTo (value, defaultValue) {
		return (value === null || value !== value) ? defaultValue : value
	}
};
