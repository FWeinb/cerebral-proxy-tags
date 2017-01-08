import {Tag} from 'cerebral/tags';

export default class ProxyTag extends Tag {
	getTags() {
		return [this].concat(this.getNestedTags());
	}
	getPath(getters) {
		if (!getters) {
			throw new Error('You can not grab tags from a Tag without getters');
		}

		return this.populatePath(getters);
	}
	getValue(getters) {
		if (!getters) {
			throw new Error('You can not grab values from a Tag without getters');
		}

		if (!getters[this.type]) {
			throw new Error(`Tag of type ${this.type.toUpperCase()} can not be used in this context`);
		}

		return typeof getters[this.type] === 'function' ?
		getters[this.type](this.getPath(getters)) :
		this.extractValueWithPath(getters[this.type], this.getPath(getters));
	}
	getNestedTags() {
		const path = [];
		for (let i = 0; i < this.$$path.length; i++) {
			const valueTemplate = this.$$path[i];
			if (valueTemplate instanceof Tag) {
				return path.concat(valueTemplate.getTags());
			}
		}
		return path;
	}
	populatePath(getters) {
		const path = [];
		for (let i = 0; i < this.$$path.length; i++) {
			const valueTemplate = this.$$path[i];
			if (valueTemplate instanceof Tag) {
				path.push(valueTemplate.getValue(getters));
			} else {
				path.push(valueTemplate);
			}
		}
		return path.join('.');
	}

}
