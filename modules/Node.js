import { getRandom, createEl } from "./util.js";
import Connector from "./Connector.js";

export default class Node {
	static coreNode;
	static id = 0;

	constructor(value = getRandom(-100, 100)) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.root = null;
		this.rootRef = null;
		this.dom = Node.createNodeDom(this, this.value);
		this.level = 1;

		Node.coreNode = Node.coreNode ?? this;
		if (Node.coreNode === this) {
			this.dom.addEventListener('click', () => Node.coreNode = null);
		}
	}

	static createNodeDom(node, value) {
		let domEl = createEl('div', 'binary-tree__node');
		domEl.append(createEl('div', 'binary-tree__node-value', value.toString()));
		domEl.dataset.nodeId = String(Node.id++);

		domEl.addEventListener('click', function (e){
			e.stopPropagation();
			Node.remove(node, this)
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
		node.dom.classList.add('highlight');
		setTimeout(() => node.dom.classList.remove('highlight'), 250)
	}

	static remove(node, dom) {
		let parent = dom.parentNode;
		let parentIsContainer = parent.classList.contains('binary-tree__node-container');
		let delay = parseFloat(getComputedStyle(dom).animationDuration) * 1000;

		setTimeout(() => {
			parentIsContainer ? parent.remove() : dom.remove();
		}, delay);

		dom.style.opacity = '0';
		Connector.removeLines(node);
		node.root[node.rootRef] = null;
	}

	static insert(node, newNode) {
		if (newNode.value === node.value) {
			Node.highlightEqual(node);
			return;
		} else if (newNode.value > node.value) {
			if (node.right) {
				newNode.level++;
				return this.insert(node.right, newNode)
			} else {
				node.right = newNode;
				newNode.rootRef = 'right';
			}
		} else if (newNode.value < node.value) {
			if (node.left) {
				newNode.level ++;
				return this.insert(node.left, newNode)
			} else {
				node.left = newNode;
				newNode.rootRef = 'left';
			}
		}
		newNode.root = node;

		return node
	}
}