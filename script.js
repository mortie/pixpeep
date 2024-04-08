let fileInput = document.getElementById("fileInput");
let widthInput = document.getElementById("widthInput");
let heightInput = document.getElementById("heightInput");
let pixfmtInput = document.getElementById("pixfmtInput");
let alphaModeInput = document.getElementById("alphaModeInput");

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

	switch (pixfmt) {
	case "rgb":
		convertRGB(dest, src, width, height, 0, 1, 2);
		break;
	case "bgr":
		convertRGB(dest, src, width, height, 2, 1, 0);
		break;
	case "rgba":
		convertRGBA(dest, src, width, height, 0, 1, 2, 3);
		break;
	case "bgra":
		convertRGBA(dest, src, width, height, 2, 1, 0, 3);
		break;
	case "argb":
		convertRGBA(dest, src, width, height, 1, 2, 3, 0);
		break;
	case "abgr":
		convertRGBA(dest, src, width, height, 3, 2, 1, 0);
		break;
	case "greyscale":
		convertGreyscale(dest, src, width, height);
		break;
	case "i420":
		convertI420(dest, src, width, height);
		break;
	case "nv12":
		convertNV(dest, src, width, height, 0, 1);
		break;
	case "nv21":
		convertNV(dest, src, width, height, 1, 0);
		break;
	case "yuyv":
		convertPacked422(dest, src, width, height, 0, 2, 1, 3);
		break;
	case "yvyu":
		convertPacked422(dest, src, width, height, 0, 2, 3, 1);
		break;
	default:
		console.warn("Unknown pixel format:", pixfmt);
		metaInfo.innerText += " -- Unknown pixel format!";
		return;
	}

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

if (fileInput.files.length >= 1) {
	loadFile(fileInput.files[0]);
}
