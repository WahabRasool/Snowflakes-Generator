"use strict";
class SnowFlake {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;
	}
	update() {
		this.y += 0.5 + 0.5 * (this.size / 7) ** 2;
		this.x = this.x + 0.1 * Math.sin(this.y / 20);
	}
	render(ctx) {
		const side = this.size * 15 + 20;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(-side / 2, -side * 0.866);
		ctx.lineTo(side / 2, -side * 0.866);
		ctx.fillStyle = "rgba(128, 200, 255, 0.75)";
		ctx.fill();
		ctx.restore();
		this.generateSierpinski(this.size, this.x, this.y, side).map((s) =>
			this.drawWhiteTriangle(ctx, s.x, s.y, s.side)
		);
	}
	drawWhiteTriangle(_ctx, _x, _y, _side) {
		_ctx.save();
		_ctx.translate(_x, _y);
		_ctx.beginPath();
		_ctx.moveTo(0, 0);
		_ctx.lineTo(-_side / 2, _side * 0.866);
		_ctx.lineTo(_side / 2, _side * 0.866);
		_ctx.fillStyle = "rgba(228, 243, 255, 0.95)";
		_ctx.fill();
		_ctx.restore();
	}
	generateSierpinski(level, x, y, side) {
		if (level === 0) {
			return [];
		}
		let result = [
			{
				x: x,
				y: y - side * 0.866,
				side: side / 2
			}
		];
		if (level === 1) {
			return result;
		}
		const newSide = side / 2;
		const newHeight = newSide * 0.866;
		const leftST = this.generateSierpinski(
			level - 1,
			x - newSide / 2,
			y - newHeight,
			newSide
		);
		const rightST = this.generateSierpinski(
			level - 1,
			x + newSide / 2,
			y - newHeight,
			newSide
		);
		const bottomST = this.generateSierpinski(level - 1, x, y, newSide);
		return [...result, ...leftST, ...rightST, ...bottomST];
	}
}
function toggleSnowstorm() {
	const snowstormInput = document.getElementById("snowstorm_input");
	const sizeInput = document.getElementById("size_input");
	sizeInput.disabled = snowstormInput.checked;
}
const container = document.getElementById("container");
if (!container) throw new Error("Container not found");
const canvasWidth = container.clientWidth;
const canvasHeight = container.clientHeight;
const canvas = document.getElementById("snowfall_canvas");
if (!canvas) throw new Error("Canvas not found");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Context not found");
let snowflakes = [];
let startTime = 0;
const generateSnowflakes = (s, random) => {
	const numOfFlakes = 5;
	return Array.from(
		{ length: numOfFlakes },
		(_, i) =>
			new SnowFlake(
				((Math.random() + i) * canvasWidth) / numOfFlakes,
				0,
				random ? Math.round(Math.random() * 6 + 1) : s
			)
	);
};
const getSizeValue = () => {
	const sizeInput = document.getElementById("size_input");
	return Number(sizeInput.value);
};
const getSnowstormValue = () => {
	const snowstormInput = document.getElementById("snowstorm_input");
	return snowstormInput.checked;
};
const initScene = () => {
	const initialSizeValue = getSizeValue();
	const initialSnowstormValue = getSnowstormValue();
	const randomsfs = generateSnowflakes(initialSizeValue, initialSnowstormValue);
	snowflakes = [...randomsfs];
};
const cleanupScene = () => {
	snowflakes = snowflakes.filter((sf) => sf.y < canvasHeight + 40);
};
const run = (id) => {
	if (id - startTime > 1000) {
		startTime = id;
		const currSizeValue = getSizeValue();
		const currSnowStormValue = getSnowstormValue();
		snowflakes = [
			...snowflakes,
			...generateSnowflakes(currSizeValue, currSnowStormValue)
		];
	}
	cleanupScene();
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	snowflakes.map((sf) => sf.update());
	snowflakes.map((sf) => sf.render(ctx));
	window.requestAnimationFrame((id) => run(id));
};
initScene();
window.requestAnimationFrame((id) => run(id));
