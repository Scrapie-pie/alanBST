'use strict';


class Node {
	constructor(value = getRandom(-100, 100)) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.root = null;
		this.dom = Node.createNodeDom(this, this.value);
		this.level = 1;
	}

	static createNodeDom(node, value) {
		let domEl = createEl('div', 'binary-tree__node');
		domEl.append(createEl('div', 'binary-tree__node-value', value));
		domEl.addEventListener('click', function (e){
			e.stopPropagation();
			this.style.opacity = '0';
			if (node.root.left === node) {
				node.root.left = null
			} else {
				node.root.right = null
			}
			setTimeout(() => {
				this.remove()
			}, 500);
		});
		domEl.addEventListener('mouseover', function (e){
			e.stopPropagation();
			this.classList.add('remove')
			this.querySelectorAll('.binary-tree__node').forEach(child => {
				child.classList.add('remove')
			})
		});
		domEl.addEventListener('mouseout', function (e){
			e.stopPropagation();
			this.classList.remove('remove')
			this.querySelectorAll('.binary-tree__node').forEach(child => {
				child.classList.remove('remove')
			})
		});
		return domEl;
	}

	static highlightEqual(node) {
		node.dom.classList.add('highlight')
	}

	static highlightRemove(node) {
		node.dom.classList.add('remove')
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
			rootNode.dom.addEventListener('click', () => rootNode = null);
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

				let space = 300 / newNode.level;
				container.style[direct] = `-${space}px`;
				container.style.bottom = `-${newNode.level * 5 + 10}px`;
			}
		}
	}
});
