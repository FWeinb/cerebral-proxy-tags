/* global test, expect */
import {string, input} from '../index';

test('string should evaluate other tags', () => {
	const getters = {
		input: {
			foo: 'World'
		}
	};

	expect(string`Hello ${input.foo}`.getValue(getters)).toBe('Hello World');
});

test('should evaluate string in tag accessor', () => {
	const getters = {
		input: {
			fooBar: 'World',
			foo: 'foo'
		}
	};

	const dynamicTag = input[string`${input.foo}Bar`];

	expect(dynamicTag.getPath(getters)).toBe('fooBar');
	expect(dynamicTag.getValue(getters)).toBe('World');

	expect(string`Hello ${dynamicTag}`.getValue(getters)).toBe('Hello World');
});
