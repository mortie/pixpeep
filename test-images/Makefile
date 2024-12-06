FFMPEG = ffmpeg -loglevel warning

FORMATS = rgb bgr rgba bgra argb abgr nv12 nv21 yuyv yvyu i420 rgb565le rgb565be bgr565le bgr565be
IMAGES = \
	$(patsubst %,peppers_267x267.%,$(FORMATS)) \
	$(patsubst %,tulips_768x512.%,$(FORMATS)) \
	$(patsubst %,alphatest_380x287.%,$(FORMATS))

.PHONY: all
all: $(IMAGES)

%.rgb: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgb24 $@
%.rgb: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgb24 $@

%.bgr: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgr24 $@
%.bgr: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgr24 $@

%.rgba: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgba $@
%.rgba: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgba $@

%.bgra: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgra $@
%.bgra: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgra $@

%.argb: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt argb $@
%.argb: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt argb $@

%.abgr: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt abgr $@
%.abgr: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt abgr $@

%.nv12: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt nv12 $@
%.nv12: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt nv12 $@

%.nv21: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt nv21 $@
%.nv21: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt nv21 $@

%.yuyv: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yuyv422 $@
%.yuyv: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yuyv422 $@

%.yvyu: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yvyu422 $@
%.yvyu: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yvyu422 $@

%.i420: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yuv420p $@
%.i420: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt yuv420p $@

%.rgb565le: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgb565le $@
%.rgb565le: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgb565le $@

%.rgb565be: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgb565be $@
%.rgb565be: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt rgb565be $@

%.bgr565le: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgr565le $@
%.bgr565le: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgr565le $@

%.bgr565be: %.jpg
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgr565be $@
%.bgr565be: %.png
	$(FFMPEG) -y -i $< -f rawvideo -pix_fmt bgr565be $@

.PHONY: clean
clean:
	rm -f $(patsubst %,*.%,$(FORMATS))
