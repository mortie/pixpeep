FFMPEG = ffmpeg -loglevel warning

all: $(patsubst %,peppers_267x267.%,rgb bgr nv12 nv21 yuyv yvyu i420)

%.rgb: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgb24 $@

%.bgr: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgr24 $@

%.nv12: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt nv12 $@

%.nv21: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt nv21 $@

%.yuyv: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yuyv422 $@

%.yvyu: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yvyu422 $@

%.i420: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yuv420p $@

.PHONY: clean
clean:
	rm -f *.rgb *.bgr *.nv12 *.nv21 *.yuyv *.yvyu *.i420
