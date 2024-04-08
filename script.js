let fileInput = document.getElementById("fileInput");
let widthInput = document.getElementById("widthInput");
let heightInput = document.getElementById("heightInput");
let pixfmtinput = document.getElementById("pixfmtInput");

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

	metaInfo.innerText = width + "x" + height + "/" + pixfmt;

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
		metaInfo.innerText += " -- Unknown pixfmt!";
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

if (fileInput.files.length >= 1) {
	loadFile(fileInput.files[0]);
}
