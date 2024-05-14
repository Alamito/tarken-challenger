"use strict";

const getPixels = require('get-pixels');
const sizeOf = require('image-size');

const pixelGetter = () => {
	const promiseCallback = (res, rej) => {
    getPixels('./meteor_challenge_01.png', (err, pixels) => {
			if (err) {
				console.log('Bad image path');
				return rej(err);
			}
			return res(pixels.data);
    });
	};

	return new Promise(promiseCallback);
};

const pixelsCounter = (color) => {
	const {R, G, B} = color;
	const promiseCallback = async (res) => {
		const pixelsData = await pixelGetter();
		let pixelCount = 0;
		for (let i = 0; i < pixelsData.length; i += 4) {
			if (pixelsData[i] === R && pixelsData[i + 1] === G && pixelsData[i + 2] === B) {
				pixelCount++;
			}
		}
		return res(pixelCount);
	};

	return new Promise(promiseCallback);
};

const getWidthFromImg = () => {
	const promiseCallback = (res) => {
		const dimensions = sizeOf('./meteor_challenge_01.png');
		return res(dimensions.width);
	};

	return new Promise(promiseCallback);
};

const getPixelPosition = (color, allowDuplicates = false) => {
	const {R, G, B} = color;
	const promiseCallback = async (res) => {
		const pixelsData = await pixelGetter();
		const width = await getWidthFromImg();
		const postionPixels = [];
		let pixelPosition = 1;
	
		for (let i = 0; i < pixelsData.length; i += 4) {
			if (pixelsData[i] === R && pixelsData[i + 1] === G && pixelsData[i + 2] === B) {
				if (allowDuplicates) {
					postionPixels.push(pixelPosition);
					continue;
				}

				postionPixels.includes(pixelPosition) ? null : postionPixels.push(pixelPosition);
			}
			if (pixelPosition++ === width) {
				pixelPosition = 1;
			}
		}

		return res(postionPixels);
	};

	return new Promise(promiseCallback);
};

const intersectionBetweenArrays = (arr1, arr2) => {
	return arr1.filter(value => arr2.includes(value));
};

( async () => {
	const COLOR_STAR = {R: 255, G: 255, B: 255};
	const COLOR_METEOR = {R: 255, G: 0, B: 0};
	const COLOR_WATER = {R: 0, G: 0, B: 255};

	const startCounter = await pixelsCounter(COLOR_STAR);
	const meteorCounter = await pixelsCounter(COLOR_METEOR);
	const waterPosition = await getPixelPosition(COLOR_WATER, false);
	const meteorPosition = await getPixelPosition(COLOR_METEOR, true);
	const amountOfMeteorsInWater = intersectionBetweenArrays(meteorPosition, waterPosition).length;

	console.log(`There are ${startCounter} stars in the image`);
	console.log(`There are ${meteorCounter} meteors in the image`);
	console.log(`The amount of meteors that will fall in the water are ${amountOfMeteorsInWater}`);
})();
