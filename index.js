'use strict';


class Node {
	static id = 0;

	constructor(value = getRandom(-100, 100)) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.root = null;
		this.dom = Node.createNodeDom(this, this.value);
		this.level = 1;
		this.domId = Node.id;
	}

	static createNodeDom(node, value) {
		let domEl = createEl('div', 'binary-tree__node');
		domEl.append(createEl('div', 'binary-tree__node-value', value.toString()));
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

		domEl.setAttribute('id', `node_id-${Node.id++}`);
		console.log(node)

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

function getOffset( el ) {
	let rect = el.getBoundingClientRect();
	return {
		left: rect.left + window.pageXOffset,
		top: rect.top + window.pageYOffset,
		width: rect.width || el.offsetWidth,
		height: rect.height || el.offsetHeight
	};
}

function drawLine(div1, div2, color, thickness) { // draw a line connecting elements
	let off1 = getOffset(div1);
	let off2 = getOffset(div2);
	// bottom right
	let x1 = off1.left + off1.width / 2;
	let y1 = off1.top + off1.height;
	// top right
	let x2 = off2.left + off2.width / 2;
	let y2 = off2.top;
	// distance
	let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
	// center
	let cx = ((x1 + x2) / 2) - (length / 2);
	let cy = ((y1 + y2) / 2) - (thickness / 2);
	// angle
	let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
	// make hr
	let htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
	//
	// alert(htmlLine);
	document.getElementById('lines').innerHTML += htmlLine;
}

console.log(document.innerHTML)

let tree = document.getElementById('tree');
let rootNode;

document.addEventListener('keydown', event => {
	if (event.code === 'Space') {
		if (event.target === document.body) {
			event.preventDefault();
		}

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

				if (foundRootNode.right === newNode) {
					direct = 'right';
				} else if (foundRootNode.left === newNode) {
					direct = 'left'
				}

				let space = 300 / newNode.level;
				container.style[direct] = `-${space}px`;
				container.style.bottom = `-${newNode.level * 5 + 10}px`;

				let rootEl = document.getElementById(foundRootNode.dom.getAttribute('id'));
				let childEl = document.getElementById(newNode.dom.getAttribute('id'));

				drawLine(rootEl, childEl, "black", 2);
			}
		}
	}
});
