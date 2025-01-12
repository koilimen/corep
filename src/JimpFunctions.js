export function Grayscale() {
    this.run = function (image) {
        image.greyscale();
    }
}

export function Blur(args) {
    this.radius = args.radius;
    this.run = (image) => {
        image.blur(this.radius);
    }
}

export const functionsHash = {
    "Grayscale": Grayscale,
    "Blur": Blur
}