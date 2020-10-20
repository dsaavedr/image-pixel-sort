const url = "https://cdnuploads.aa.com.tr/uploads/Contents/2020/05/14/thumbs_b_c_88bedbc66bb57f0e884555e8250ae5f9.jpg?v=140708";
// const url = "https://i.insider.com/5df126b679d7570ad2044f3e?width=1100&format=jpeg&auto=webp";

var WIDTH, HEIGHT;

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

let img = new Image();
img.src = url + '?' + new Date().getTime();
img.setAttribute("crossOrigin", "");
img.onload = (e) => init(e);

function init(e) {
    const { naturalHeight, naturalWidth } = e.path[0];

    WIDTH = naturalWidth;
    HEIGHT = naturalHeight;

    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT);

    ctx.drawImage(img, 0, 0);

    let imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
    let data = imgData.data;

    log(imgData);

    // Put pixel data in nested arrays for later sorting

    let pixels = []
    for (let i = 0; i < data.length; i += 4) {
        pixels.push([
            data[i],
            data[i + 1],
            data[i + 2],
            data[i + 3]
        ]);
    }

    sortedPixels = pixels.map((c, i) => {
        // RGB to HSL
        return { color: RGBtoHSL(c[0], c[1], c[2]), index: i }
    }).sort((c1, c2) => {
        // Sort by hue
        return c1.color[0] - c2.color[0];
    }).map(d => {
        // Return original rgb value
        return pixels[d.index];
    });

    // Extend sortedPixels

    let sp = [];

    for (let i = 0; i < sortedPixels.length; i++) {
        let p = sortedPixels[i];
        for (let j = 0; j < p.length; j++) {
            sp.push(p[j]);
        }
    }

    let newData = ctx.createImageData(imgData.width, imgData.height);

    for (let i = 0; i < newData.data.length; i++) {
        newData.data[i] = sp[i]
    }

    ctx.putImageData(newData, 0, 0);

    ani();
}

function ani() {


    //requestAnimationFrame(ani);
}

function loadImage(url) {
    return new Promise(r => {
        let i = new Image();
        i.onload = (() => r(i));
        i.src = url;
    })
}