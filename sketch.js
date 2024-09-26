let colors = ['#FFDDC1', '#FCA5A5', '#A5B4FC']; // Change these to your preferred colors
let currentColor;

function setup() {
    createCanvas(windowWidth, windowHeight);
    currentColor = colors[0];
    noLoop(); // Stops draw from running repeatedly
}

function draw() {
    background(currentColor);
}

function changeColor(newColor) {
    currentColor = newColor;
    redraw(); // Redraw with the new color
}
