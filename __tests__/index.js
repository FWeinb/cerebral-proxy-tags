/* global test, expect */
import {Tag} from 'cerebral/tags';
import ProxyTag from '../proxy-tag';
import * as tags from '../index'; // eslint-disable-line no-duplicate-imports

test('index should export all needed tags', () => {
	expect(Object.keys(tags)).toEqual(expect.arrayContaining(['string', 'state', 'signal', 'props', 'input']));

	Object.keys(tags)
	.filter(name => name !== 'string') // String is a little bit special
	.forEach(name => {
		expect(tags[name]).toBeInstanceOf(Tag);
		expect(tags[name]).toBeInstanceOf(ProxyTag);
	});
});
