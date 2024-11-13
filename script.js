let fileInput = document.getElementById("fileInput");
let widthInput = document.getElementById("widthInput");
let heightInput = document.getElementById("heightInput");
let pixfmtInput = document.getElementById("pixfmtInput");
let alphaModeInput = document.getElementById("alphaModeInput");
let byteOffsetInput = document.getElementById("byteOffsetInput");

let data = null;

let metaInfo = document.getElementById("metaInfo");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function update() {
	if (!data) {
		return;
	}

	let width = parseInt(widthInput.value);
	let height = parseInt(heightInput.value);
	let pixfmt = pixfmtInput.value;
	let alphaMode = alphaModeInput.value;

	metaInfo.innerText = width + "x" + height + " " + pixfmt;

	canvas.width = width;
	canvas.height = height;

	let imageData = ctx.createImageData(width, height);

	let dest = imageData.data;
	let src = data;

	let fmtdata = pixfmts[pixfmt];
	if (!fmtdata) {
		console.warn("Unknown pixel format:", pixfmt);
		metaInfo.innerText += " -- Unknown pixel format!";
		return;
	}

	let offsetStr = byteOffsetInput.value.trim();
	let offset = parseInt(offsetStr);
	if (isNaN(offset)) {
		offset = 0;
	}
	if (offsetStr.endsWith("f") || offsetStr.endsWith("F")) {
		offset *= width * height * fmtdata.bpp;
	}
	offset = Math.round(offset);

	fmtdata.convert(dest, src, offset, width, height);

	// Canvas image data is assumed to be "straight" (i.e not pre-multiplied).
	// Therefore, we have to convert the pixel buffer from a given alpha mode
	// to straight alpha.
	switch (alphaMode) {
	case "straight":
		break;
	case "ignore":
		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				let pix = (y * width + x) * 4;
				dest[pix + 3] = 255;
			}
		}
		break;
	case "premultiplied":
		// If the image uses pre-multiplied alpha,
		// that means the RGB values are multiplied by the alpha.
		// Divide by the alpha again to go back to straight alpha.
		// Once https://github.com/whatwg/html/pull/5371 is finalized
		// and part of all browsers, we should be able to avoid this.
		for (let y = 0; y < height; ++y) {
			for (let x = 0; x < width; ++x) {
				let pix = (y * width + x) * 4;
				let alpha = dest[pix + 3] / 255;
				if (alpha != 0) {
					dest[pix + 0] /= alpha;
					dest[pix + 1] /= alpha;
					dest[pix + 2] /= alpha;
				}
			}
		}
		break;
	default:
		console.warn("Unknown alpha mode:", alphaMode);
		metaInfo.innerText += " -- Unknown alpha mode!";
		return;
	}

	ctx.putImageData(imageData, 0, 0);
}

function loadFile(file) {
	let reader = new FileReader();
	reader.addEventListener("load", evt => {
		data = new Uint8Array(evt.target.result);
		update();
	});
	reader.readAsArrayBuffer(file);
}

fileInput.onchange = evt => {
	if (evt.target.files.length < 1) {
		return;
	}

	loadFile(evt.target.files[0]);
};

widthInput.onchange = update;
heightInput.onchange = update;
pixfmtInput.onchange = update;
alphaModeInput.onchange = update;
byteOffsetInput.onchange = update;

if (fileInput.files.length >= 1) {
	loadFile(fileInput.files[0]);
}
