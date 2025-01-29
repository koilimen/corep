import { Jimp } from "jimp";

export async function manipulate(data, type, success) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const arrayBuffer = event.target.result;

        Jimp.fromBuffer(arrayBuffer)
            .then(image => {
                image.color([
                    { apply: "hue", params: [-80] },
                    { apply: "desaturate", params: [50] },
                ]);
                if (type == 'jpg') type = 'jpeg';
                success(image.getBuffer("image/" + type));
            });
    };
    fileReader.readAsArrayBuffer(data);
}
