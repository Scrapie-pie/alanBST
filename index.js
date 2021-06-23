'use strict';


class Node {
	static coreNode;

		constructor(value = getRandom(-100, 100)) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.root = null;
		this.rootRef = null;
		this.dom = Node.createNodeDom(this, this.value);
		this.level = 1;

		Node.coreNode = Node.coreNode ?? this;
	}

	static createNodeDom(node, value) {
		let domEl = createEl('div', 'binary-tree__node');
		domEl.append(createEl('div', 'binary-tree__node-value', value.toString()));

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
		node.dom.classList.add('highlight')
	}

	static remove(node, dom) {
		let parent = dom.parentNode;
		let parentIsContainer = parent.classList.contains('binary-tree__node-container');
		let duration = parseFloat(getComputedStyle(dom).animationDuration) * 1000;

		dom.style.opacity = '0';

		setTimeout(() => {
			parentIsContainer ? parent.remove() : dom.remove();
		}, duration);

		node.root[node.rootRef] = null;
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

function drawLine(to, div1, div2, color, thickness) {
	let off1 = getOffset(div1);
	let off2 = getOffset(div2);
	let x1 = off1.left + off1.width / 2;
	let y1 = off1.top + off1.height;
	let x2 = off2.left + off2.width / 2;
	let y2 = off2.top + 1;
	let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
	let cx = ((x1 + x2) / 2) - (length / 2);
	let cy = ((y1 + y2) / 2) - (thickness / 2);
	let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
	let htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";

	to.innerHTML += htmlLine;
}

function spaceBarHandler() {
	if (!Node.coreNode) {
		let rootNode = new Node();
		rootNode.dom.addEventListener('click', () => Node.coreNode = null);
		document.getElementById('tree').append(rootNode.dom);

	} else {
		let newNode = new Node;
		let foundRootNode = Node.insert(Node.coreNode, newNode);

		if (foundRootNode) {
			let container = createEl('div', 'binary-tree__node-container');
			foundRootNode.dom.append(container);
			container.append(newNode.dom);

			let direct = newNode.rootRef;

			if (direct) {
				let space = 300 / newNode.level;
				container.style[direct] = `-${space}px`;
				container.style.bottom = `-${newNode.level * 5 + 10}px`;

				let lines = document.getElementById('lines')
				drawLine(lines, foundRootNode.dom, newNode.dom, "black", 2);
			}
		}
	}
}


document.addEventListener('keydown', event => {
	if (event.code === 'Space') {
		if (event.target === document.body) {
			event.preventDefault();
		}
		spaceBarHandler();
	}
});
