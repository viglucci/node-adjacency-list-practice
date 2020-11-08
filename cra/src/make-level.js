function visitEachCell(level, cb) {
	for (let j = 0; j < level.height; j++)
	{
		for (let i = 0; i < level.width; i++)
		{
			const value = level.matrix[j][i];
			cb({ x: i, y: j, value });
		}
	}
}

function getConnectedCoords({ x, y }) {
	const top = { x: x, y: y - 1 };
	const right = { x: x + 1, y };
	const bottom = { x: x, y: y + 1 };
	const left = { x: x - 1, y };
	return {
		top,
		bottom,
		left,
		right
	};
}

function getIndex({ x, y }, width) {
	return x + (y * width);
}

function genLevelString(tokens, width, height) {
	const rows = [];

	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			row.push(tokens[Math.floor(Math.random() * tokens.length)]);
		}
		rows.push(row);
	}

	return rows;
}

function isOnBoard({ x, y }, level) {
	return y >= 0 &&
		y < level.height &&
		x >= 0 &&
		x < level.width;
}

function makeLevel() {
	const tokens = ["a", "b", "c"];

	const matrix = genLevelString(tokens, 6, 6);

	const level = {
		height: matrix.length,
		width: matrix[0].length,
		matrix,
		list: [],
		adjacencyList: [],
		matches: [],
		matchCounts: {}
	};

	visitEachCell(level, ({ x, y, value }) => {
		const index = getIndex({ x, y, }, level.width);
		level.list[index] = { x, y, value };
	});

	level.list.forEach((cell, index) => {
		const cellIndex = getIndex(cell, level.width);
		level.adjacencyList[cellIndex] = level.adjacencyList[cellIndex] || [];

		function isValid (subject) {
			return subject
				&& tokens.includes(subject.value)
				&& subject.value === cell.value;
		}

		const {top, right, bottom, left} = getConnectedCoords(cell);

		if (isOnBoard(top, level)) {
			const topIndex = getIndex(top, level.width);
			if (isValid(level.list[topIndex])) {
				level.adjacencyList[cellIndex].push(topIndex);
			}
		}

		if (isOnBoard(right, level)) {
			const rightIndex = getIndex(right, level.width);
			if (isValid(level.list[rightIndex])) {
				level.adjacencyList[cellIndex].push(rightIndex);
			}
		}

		if (isOnBoard(bottom, level)) {
			const bottomIndex = getIndex(bottom, level.width);
			if (isValid(level.list[bottomIndex])) {
				level.adjacencyList[cellIndex].push(bottomIndex);
			}
		}

		if (isOnBoard(left, level)) {
			const leftIndex = getIndex(left, level.width);
			if (isValid(level.list[leftIndex])) {
				level.adjacencyList[cellIndex].push(leftIndex);
			}
		}
	});

	const seen = new Set();
	for (let i = 0; i < level.adjacencyList.length; i++) {
		if (seen.has(i)) {
			continue;
		}
		const path = [];
		let queue = [i];
		while(queue.length > 0) {
			let next = queue.pop();
			if (!seen.has(next)) {
				seen.add(next);
				let adjacents = level.adjacencyList[next];
				for (let j = 0; j < adjacents.length; j++) {
					queue.push(adjacents[j]);
				}
				path.push(next);
			}
		}
		if (path.length > 1) {
			level.matches.push(path);
		}
	}

	for(let i = 0; i < level.matches.length; i++) {
		const match = level.matches[i];
		for (let j = 0; j < match.length; j++) {
			const count = match.length;
			const listIndex = match[j];
			level.matchCounts[listIndex] = count;
		}
	}

	return level;
}

module.exports = {
	makeLevel,
	getIndex
};