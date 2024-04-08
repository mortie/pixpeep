function convertRGB(dest, src, width, height, r, g, b) {
	let srci = 0;
	let desti = 0;
	for (let i = 0; i < width * height; ++i) {
		dest[desti++] = src[srci + r];
		dest[desti++] = src[srci + g];
		dest[desti++] = src[srci + b];
		dest[desti++] = 255;
		srci += 3;
	}
}

function convertRGBA(dest, src, width, height, r, g, b, a) {
	let srci = 0;
	let desti = 0;
	for (let i = 0; i < width * height * 4; ++i) {
		dest[desti++] = src[srci + r];
		dest[desti++] = src[srci + g];
		dest[desti++] = src[srci + b];
		dest[desti++] = src[srci + a];
		srci += 4;
	}
}

function convertGreyscale(dest, src, width, height) {
	let desti = 0;
	for (let i = 0; i < width * height; ++i) {
		dest[desti++] = src[i];
		dest[desti++] = src[i];
		dest[desti++] = src[i];
		dest[desti++] = 255;
	}
}

function yuvToRGBA(dest, i, y, u, v) {
	y -= 16;
	u -= 128;
	v -= 128;
	dest[i + 0] = 1.164 * y + 1.596 * v;
	dest[i + 1] = 1.164 * y - 0.392 * u - 0.813 * v;
	dest[i + 2] = 1.164 * y + 2.017 * u;
	dest[i + 3] = 255;
}

function convertI420(dest, src, width, height) {
	let uPlane = width * height;
	let vPlane = uPlane + Math.floor((width * height) / 4);

	for (let y = 0; y < height; ++y) {
		for (let x = 0; x < width; ++x) {
			let uv = Math.floor(y / 2) * Math.floor(width / 2) +
				Math.floor(x / 2);

			yuvToRGBA(
				dest, (y * width + x) * 4,
				src[y * width + x],
				src[uPlane + uv],
				src[vPlane + uv]);
		}
	}
}

function convertNV(dest, src, width, height, u, v) {
	let uvPlane = width * height;

	for (let y = 0; y < height; ++y) {
		for (let x = 0; x < width; ++x) {
			let uv = Math.floor(y / 2) * width + Math.floor(x / 2) * 2;

			yuvToRGBA(
				dest, (y * width + x) * 4,
				src[y * width + x],
				src[uvPlane + uv + u],
				src[uvPlane + uv + v]);
		}
	}
}

function convertPacked422(dest, src, width, height, y1, y2, u, v) {
	let srci = 0;
	let desti = 0;
	for (let i = 0; i < width * height; ++i) {
		yuvToRGBA(dest, desti,
			src[srci + y1],
			src[srci + u],
			src[srci + v]);
		desti += 4;

		yuvToRGBA(dest, desti,
			src[srci + y2],
			src[srci + u],
			src[srci + v]);
		desti += 4;

		srci += 4;
	}
}
