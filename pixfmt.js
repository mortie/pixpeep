function convertRGB(dest, src, soffset, width, height, r, g, b) {
	let srci = soffset;
	let desti = 0;
	for (let i = 0; i < width * height; ++i) {
		dest[desti++] = src[srci + r];
		dest[desti++] = src[srci + g];
		dest[desti++] = src[srci + b];
		dest[desti++] = 255;
		srci += 3;
	}
}

function convertRGBA(dest, src, soffset, width, height, r, g, b, a) {
	let srci = soffset;
	let desti = 0;
	for (let i = 0; i < width * height * 4; ++i) {
		dest[desti++] = src[srci + r];
		dest[desti++] = src[srci + g];
		dest[desti++] = src[srci + b];
		dest[desti++] = src[srci + a];
		srci += 4;
	}
}

function convertRGB565(dest, src, soffset, width, height, r, g, b, big_endian) {
    let srci = soffset;
    let desti = 0;
    for (let i = 0; i < width * height; ++i) {
		let pixel = (
			big_endian ?
				(src[srci] << 8) | src[srci+1] 
				:(src[srci+1] << 8) | src[srci]
		);
		let third = 0x1f & pixel;
		let second = 0x3f & (pixel >> 5);
		let first = 0x1f & (pixel >> (5+6));

        let pixels = [Math.round( first * 255.0 / 31.0), Math.round( second * 255.0 / 63.0), Math.round( third * 255.0 / 31.0)];
        dest[desti++] = pixels[r];
        dest[desti++] = pixels[g];
        dest[desti++] = pixels[b];
        dest[desti++] = 255;
        srci += 2;
    }
}

function convertGreyscale(dest, src, soffset, width, height) {
	let srci = soffset;
	let desti = 0;
	for (let i = 0; i < width * height; ++i) {
		dest[desti++] = src[srci];
		dest[desti++] = src[srci];
		dest[desti++] = src[srci];
		dest[desti++] = 255;
		srci += 1;
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

function convertI420(dest, src, soffset, width, height) {
	let yPlane = soffset;
	let uPlane = yPlane + width * height;
	let vPlane = uPlane + Math.floor((width * height) / 4);

	for (let y = 0; y < height; ++y) {
		let uvRow = Math.floor(y / 2) * Math.ceil(width / 2);
		for (let x = 0; x < width; ++x) {
			let uv = uvRow + Math.floor(x / 2);

			yuvToRGBA(
				dest, (y * width + x) * 4,
				src[yPlane + y * width + x],
				src[uPlane + uv],
				src[vPlane + uv]);
		}
	}
}

function convertNV(dest, src, soffset, width, height, u, v) {
	let yPlane = soffset;
	let uvPlane = yPlane + width * height;

	for (let y = 0; y < height; ++y) {
		let yRow = y * width;
		let uvRow = Math.floor(y / 2) * Math.ceil(width / 2) * 2;
		for (let x = 0; x < width; ++x) {
			let uv = uvRow + Math.floor(x / 2) * 2;

			yuvToRGBA(
				dest, (y * width + x) * 4,
				src[yPlane + yRow + x],
				src[uvPlane + uv + u],
				src[uvPlane + uv + v]);
		}
	}
}

function convertPacked422(dest, src, soffset, width, height, y1, y2, u, v) {
	for (let y = 0; y < height; ++y) {
		let yuvRow = soffset + y * Math.ceil(width / 2) * 4;
		for (let x = 0; x < width; ++x) {
			let yuv = yuvRow + Math.floor(x / 2) * 4;

			yuvToRGBA(
				dest, (y * width + x) * 4,
				src[yuv + (x % 2 == 0 ? y1 : y2)],
				src[yuv + u],
				src[yuv + v]);
		}
	}
}

let pixfmts = {
	rgb: {
		bpp: 3,
		convert: (dest, src, soffset, width, height) =>
			convertRGB(dest, src, soffset, width, height, 0, 1, 2),
	},
	bgr: {
		bpp: 3,
		convert: (dest, src, soffset, width, height) =>
			convertRGB(dest, src, soffset, width, height, 2, 1, 0),
	},
	rgb565: {
		bpp: 2,
		convert: (dest, src, soffset, width, height) =>
			convertRGB565(dest, src, soffset, width, height, 0, 1, 2, false),
	},
	rgb565be: {
		bpp: 2,
		convert: (dest, src, soffset, width, height) =>
			convertRGB565(dest, src, soffset, width, height, 0, 1, 2, true),
	},
	bgr565: {
		bpp: 2,
		convert: (dest, src, soffset, width, height) =>
			convertRGB565(dest, src, soffset, width, height, 2, 1, 0, false),
	},
	bgr565be: {
		bpp: 2,
		convert: (dest, src, soffset, width, height) =>
			convertRGB565(dest, src, soffset, width, height, 2, 1, 0, true),
	},
	rgba: {
		bpp: 4,
		convert: (dest, src, soffset, width, height) =>
			convertRGBA(dest, src, soffset, width, height, 0, 1, 2, 3),
	},
	bgra: {
		bpp: 4,
		convert: (dest, src, soffset, width, height) =>
			convertRGBA(dest, src, soffset, width, height, 2, 1, 0, 3),
	},
	argb: {
		bpp: 4,
		convert: (dest, src, soffset, width, height) =>
			convertRGBA(dest, src, soffset, width, height, 1, 2, 3, 0),
	},
	abgr: {
		bpp: 4,
		convert: (dest, src, soffset, width, height) =>
			convertRGBA(dest, src, soffset, width, height, 3, 2, 1, 0),
	},
	greyscale: {
		bpp: 1,
		convert: (dest, src, soffset, width, height) =>
			convertGreyscale(dest, src, soffset, width, height),
	},
	i420: {
		bpp: 1.5,
		convert: (dest, src, soffset, width, height) =>
			convertI420(dest, src, soffset, width, height),
	},
	nv12: {
		bpp: 1.5,
		convert: (dest, src, soffset, width, height) =>
			convertNV(dest, src, soffset, width, height, 0, 1),
	},
	nv21: {
		bpp: 1.5,
		convert: (dest, src, soffset, width, height) =>
			convertNV(dest, src, soffset, width, height, 1, 0),
	},
	yuyv: {
		bpp: 1.5,
		convert: (dest, src, soffset, width, height) =>
			convertPacked422(dest, src, soffset, width, height, 0, 2, 1, 3),
	},
	yvyu: {
		bpp: 1.5,
		convert: (dest, src, soffset, width, height) =>
			convertPacked422(dest, src, soffset, width, height, 0, 2, 3, 1),
	},
}
