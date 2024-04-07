function convertRGB(dest, src, width, height) {
	let srci = 0;
	let desti = 0;
	for (let i = 0; i < width * height; ++i) {
		dest[desti++] = src[srci++];
		dest[desti++] = src[srci++];
		dest[desti++] = src[srci++];
		dest[desti++] = 255;
	}
}

function convertRGBA(dest, src, width, height) {
	for (let i = 0; i < width * height * 4; ++i) {
		dest[i] = src[i];
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
