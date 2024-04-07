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

	if (pixfmt == "rgb") {
		convertRGB(imageData.data, data, width, height);
	} else if (pixfmt == "rgba") {
		convertRGBA(imageData.data, data, width, height);
	} else if (pixfmt == "greyscale") {
		convertGreyscale(imageData.data, data, width, height);
	} else if (pixfmt == "i420") {
		convertI420(imageData.data, data, width, height);
	} else if (pixfmt == "nv12") {
		convertNV(imageData.data, data, width, height, 0, 1);
	} else if (pixfmt == "nv21") {
		convertNV(imageData.data, data, width, height, 1, 0);
	} else {
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
