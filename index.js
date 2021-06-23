'use strict';

import { createEl } from "./modules/util.js";
import Connector from "./modules/Connector.js";
import Node from "./modules/Node.js";


function spaceBarHandler() {
	if (!Node.coreNode) {
		document.getElementById('tree').append(new Node().dom);
	} else {
		let newNode = new Node;
		let foundRootNode = Node.insert(Node.coreNode, newNode);
		let container = createEl('div', 'binary-tree__node-container');
		foundRootNode.dom.append(container);
		container.append(newNode.dom);

		let direct = newNode.rootRef;
		if (newNode.rootRef) {
			let space = 300 / newNode.level;
			container.style[direct] = `-${space}px`;
			container.style.bottom = `-${newNode.level * 5 + 30}px`;

			let lines = document.getElementById('lines');
			new Connector(foundRootNode.dom, newNode.dom).push(lines)
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
