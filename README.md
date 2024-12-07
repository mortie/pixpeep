# PixPeep

This web app lets you inspect raw image data.
Load a file, select a pixel format, enter a width/height,
and view see the image.

This is similar to what rawpixels.net used to do.
I don't know what happened to that site, but it's not online anymore.
I used it all the time, which is why I needed a replacement.

https://pixpeep.mort.coffee/

## Contributing

Feel free to contribute to this project.
It's written in very basic HTML + JavaScript + CSS.
Just open index.html in your browser,
no build system or libraries or frameworks or bundling or NPM required.
(That isn't necessarily a good thing, and the code isn't very good,
I just needed something quickly and threw this together)

If you want to add a pixel format, here's what you do:

* Add a function to convert from the pixel format to RGBA to pixfmt.js
* Add an option to the `<select id="pixfmtInput">` in index.html

I'm also open to more substantive changes and new features.
