'use strict';


class Node {
	constructor(value = getRandom(-100, 100)) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.root = null;
		this.dom = Node.createNodeDom(this.value);
		this.level = 1;
	}

	static createNodeDom(value) {
		let node = createEl('div', 'binary-tree__node');
		node.append(createEl('div', 'binary-tree__node-value', value));
		return node;
	}

	static highlightEqual(node) {
		node.dom.classList.add('highlight')
	}

	static insert(node, newNode) {
		if (newNode.value === node.value) {
			Node.highlightEqual(node)
			return;
		} else if (newNode.value > node.value) {
			if (node.right) {
				newNode.level++;
				return this.insert(node.right, newNode)
			} else {
				node.right = newNode
			}
		} else if (newNode.value < node.value) {
			if (node.left) {
				newNode.level ++;
				return this.insert(node.left, newNode)
			} else {
				node.left = newNode
			}
		}
		newNode.root = node;
		return node
	}
}


function getRandom(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	let random = Math.random();
	return Math.floor(random * (max - min)) + min;
}

function createEl(tag, addClass, text) {
	let el = document.createElement(tag);
	if (addClass) el.classList.add(addClass);
	if (text) el.textContent = text;
	return el;
}

let tree = document.getElementById('tree');
let rootNode;

document.addEventListener('keyup', event => {
	if (event.code === 'Space') {
		if (!rootNode) {
			rootNode = new Node();
			tree.append(rootNode.dom);
		} else {
			let newNode = new Node;
			let foundRootNode = Node.insert(rootNode, newNode);

			if (foundRootNode) {
				let container = createEl('div', 'binary-tree__node-container');
				foundRootNode.dom.append(container);
				container.append(newNode.dom);

				let direct;
				//let indent = `${-30 * (12/newNode.level)}px`;

				if (foundRootNode.right === newNode) {
					direct = 'right';
				} else if (foundRootNode.left === newNode) {
					direct = 'left'
				}

				container.style[direct] = `${-30 * (12/newNode.level)}px`;
				container.style.bottom = `-${newNode.level * 5 + 10}px`;
			}
		}
	}
});
