import { createEl } from "./util.js";

export default class Connector {
	static color = 'black';
	static tickness = 2;
	static connectors = [];

	constructor(node, newNode) {
		this.id = newNode.dataset.nodeId;
		this.dom = Connector.createLine(node, newNode);
		this.push = (innerTo) => innerTo.append(this.dom);

		Connector.connectors.push(this)
	}

	static createLine(nodeDom, newNodeDom) {
		let nodeOffset = Connector.getOffset(nodeDom);
		let newNodeOffset = Connector.getOffset(newNodeDom);
		let x1 = nodeOffset.left + nodeOffset.width / 2;
		let y1 = nodeOffset.top + nodeOffset.height;
		let x2 = newNodeOffset.left + newNodeOffset.width / 2;
		let y2 = newNodeOffset.top + 1;
		let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
		let cx = ((x1 + x2) / 2) - (length / 2);
		let cy = ((y1 + y2) / 2) - (Connector.tickness / 2);
		let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);

		let line = createEl('div');
		let styles = {
			padding: '0px',
			margin: '0px',
			height: Connector.tickness + 'px',
			backgroundColor: Connector.color,
			lineHeight: '1px',
			position: 'absolute',
			left: cx + 'px',
			top: cy + 'px',
			width: length + 'px',
			transform: `rotate(${angle}deg)`,
			transition: getComputedStyle(nodeDom).animationDuration,
			animation: 'show ' + getComputedStyle(nodeDom).animationDuration
		};

		for (let [key, val] of Object.entries(styles)) {
			line.style[key] = val;
		}

		return line;
	}

	static removeLines(node) {
		let childrenNodes = node.dom.querySelectorAll('.binary-tree__node');
		for (let child of childrenNodes) {
			Connector.connectors.forEach((connector, index) => {
				if (connector.id === node.dom.dataset.nodeId || connector.id === child.dataset.nodeId) {
					let duration = getComputedStyle(node.dom).animationDuration;
					connector.dom.style.opacity = '0';
					connector.dom.style.transition = duration;
					setTimeout(function() {
						connector.dom.remove();
						Connector.connectors.slice(index, 1)
					}, parseFloat(duration) * 1000)
				}
			});
		}
	}

	static getOffset(el) {
		let rect = el.getBoundingClientRect();
		return {
			left: rect.left + window.pageXOffset,
			top: rect.top + window.pageYOffset,
			width: rect.width || el.offsetWidth,
			height: rect.height || el.offsetHeight
		};
	}
}