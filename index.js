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
}

const whitePixelCounter = () => {
	const promiseCallback = async (res) => {
		const pixelsData = await pixelGetter();
		let whitePixelCount = 0;
		for (let i = 0; i < pixelsData.length; i += 4) {
			if (pixelsData[i] === 255 && pixelsData[i + 1] === 255 && pixelsData[i + 2] === 255) {
				whitePixelCount++;
			}
		}
		return res(whitePixelCount);
	};

	return new Promise(promiseCallback);
};

( async () => {
	const whitePixelCount = await whitePixelCounter();
	console.log(whitePixelCount);
})();
