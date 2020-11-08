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

const tokens = ["a", "b", "c"];

const boardShape = [
	"aaa__b",
	"b_a___",
	"__a___",
];

const matrix = [];

for(let i = 0; i < boardShape.length; i++) {
	const line = boardShape[i].split("");
	matrix.push(line);
}

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

function isOnBoard({ x, y }) {
	return y >= 0 &&
		y < level.height &&
		x >= 0 &&
		x < level.width;
}

level.list.forEach((cell, index) => {
	const cellIndex = getIndex(cell, level.width);
	level.adjacencyList[cellIndex] = level.adjacencyList[cellIndex] || [];

	function isValid (subject) {
		return subject
			&& tokens.includes(subject.value)
			&& subject.value === cell.value;
	}

	const {top, right, bottom, left} = getConnectedCoords(cell);

	if (isOnBoard(top)) {
		const topIndex = getIndex(top, level.width);
		if (isValid(level.list[topIndex])) {
			level.adjacencyList[cellIndex].push(topIndex);
		}
	}

	if (isOnBoard(right)) {
		const rightIndex = getIndex(right, level.width);
		if (isValid(level.list[rightIndex])) {
			level.adjacencyList[cellIndex].push(rightIndex);
		}
	}

	if (isOnBoard(bottom)) {
		const bottomIndex = getIndex(bottom, level.width);
		if (isValid(level.list[bottomIndex])) {
			level.adjacencyList[cellIndex].push(bottomIndex);
		}
	}

	if (isOnBoard(left)) {
		const leftIndex = getIndex(left, level.width);
		if (isValid(level.list[leftIndex])) {
			level.adjacencyList[cellIndex].push(leftIndex);
		}
	}
});

const seen = new Set();
for (let i = 0; i < level.adjacencyList.length; i++) {
	if (!seen.has(i)) {
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
}

for (let i = 0; i < level.matches.length; i++) {
	const match = level.matches[i];
	for (let j = 0; j < match.length; j++) {
		const count = match.length;
		const listIndex = match[j];
		level.matchCounts[listIndex] = count;
	}
}

console.log(level);
