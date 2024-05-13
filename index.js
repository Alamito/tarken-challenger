const getPixels = require('get-pixels');

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

( async () => {
	const WHITE = {R: 255, G: 255, B: 255};
	const RED = {R: 255, G: 0, B: 0};
	const whitePixelCount = await pixelsCounter(WHITE);
	const redPixelCount = await pixelsCounter(RED);
	console.log(`There are ${whitePixelCount} stars in the image`);
	console.log(`There are ${redPixelCount} meteors in the image`);
})();
