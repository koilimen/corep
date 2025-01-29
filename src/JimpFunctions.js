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

export function Contrast(args) {
    this.value = args.value;
    this.run = (image) => {
        image.contrast(this.value);
    }
}

export function Invert() {
    this.run = (image) => {
        image.invert();
    }
}

export const FUNCTIONS_HASH = {
    "Grayscale": Grayscale,
    "Blur": Blur,
    "Contrast": Contrast,
    "Invert": Invert,
}