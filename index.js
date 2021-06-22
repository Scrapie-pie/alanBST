'use strict';


class Node {
	constructor(value = getRandom(-100, 100)) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.root = null;
		this.getDom = createEl('div', 'binary-tree__node', this.value);
		this.level = 1;
	}

	static insert(node, newNode, direct) {
		if (newNode.value > node.value) {
			if (node.right) {
				newNode.level++;
				return this.insert(node.right, newNode, 'right')
			} else {
				node.right = newNode
			}
		} else if (newNode.value < node.value) {
			if (node.left) {
				newNode.level++;
				return this.insert(node.left, newNode, 'left')
			} else {
				node.left = newNode
			}
		} else {
			//node scale(.1)
		}
		newNode.root = node;

		return { node, direct }
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
	if (addClass) el.classList.add(addClass)
	if (text) el.textContent = text;
	return el;
}

let tree = document.getElementById('tree');
let rootNode;

document.addEventListener('keyup', event => {
	if (event.code === 'Space') {
		if (!rootNode) {
			rootNode = new Node();
			tree.append(rootNode.getDom);
		} else {
			const newNode = new Node;
			let { foundRootNode, direct } = Node.insert(rootNode, newNode)

			console.log(rootNode)
		}
	}
});
