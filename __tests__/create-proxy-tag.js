/* global jest, test, expect */
import {Tag} from 'cerebral/tags';
import {createProxyTag} from '../create-proxy-tag';
import ProxyTag from '../proxy-tag';

const tag = createProxyTag('tag');

test('createProxyTag should create a ProxyTag and ProxyTag should extends Tag', () => {
	expect(tag).toBeInstanceOf(Tag);
	expect(tag).toBeInstanceOf(ProxyTag);
});

test('tag should throw without getters', () => {
	expect(tag.getPath).toThrowError('You can not grab tags from a Tag without getters');
	expect(tag.getValue).toThrowError('You can not grab values from a Tag without getters');
	expect(() => tag.getValue({})).toThrowError(/type TAG/);
});

test('tag should have Symbole.toStringTag defined', () => {
	expect(tag[Symbol.toStringTag]).toBe('');
});

test('tag can extract data from plain object', () => {
	const getters = {
		tag: {
			foo: {
				bar: {
					baz: 'data'
				}
			}
		}
	};
	expect(tag.foo.bar.baz.getValue(getters)).toBe('data');
});
test('tag can extract data from getter function', () => {
	const expectedPath = 'foo.bar.baz';
	const getters = {
		tag: jest.fn().mockImplementation(() => 'Result')
	};
	expect(tag.foo.bar.baz.getPath(getters)).toBe(expectedPath);
	expect(tag.foo.bar.baz.getValue(getters)).toBe('Result');
	expect(getters.tag).toBeCalledWith(expectedPath);
	expect(getters.tag).toHaveBeenCalledTimes(1);
	expect(tag.clients.all[tag.itemKey]['*'].getPath(getters)).toBe('clients.all.Result.*');
});

test('tag can be nested', () => {
	const otherTag = createProxyTag('otherTag');
	const getters = {
		tag: {
			foo: 'bar'
		},
		otherTag: {
			keyName: 'foo'
		}
	};

	expect(tag[otherTag.keyName].getPath(getters)).toBe('foo');
	expect(tag[otherTag.keyName].getValue(getters)).toBe('bar');
});

test('tag can list nested tags', () => {
	const tag2 = createProxyTag('tag2');
	const tag3 = createProxyTag('tag3');

	const nestedTags = tag.one[tag2.two[tag3.three]].getTags();
	expect(nestedTags).toHaveLength(3);

	expect(nestedTags.map(tag => tag.type)).toEqual(['tag', 'tag2', 'tag3']);
});

test('tag has some special properties', () => {
	expect(tag.type).toBe('tag');
	expect(tag.options.hasValue).toBe(true);
});

test('tag should remove leading underscore to generate properties accesor for names defined on ProxyTags', () => {
	const getters = {
		tag: {
			type: 'value',
			_type: 'othervalue'
		}
	};
	expect(tag._type).toBeInstanceOf(Tag);
	expect(tag._type.getPath(getters)).toBe('type');
	expect(tag._type.getValue(getters)).toBe(getters.tag.type);
	expect(tag.__type.getPath(getters)).toBe('_type');
	expect(tag.__type.getValue(getters)).toBe(getters.tag._type);
});
