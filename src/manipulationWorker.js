import { Jimp } from "jimp";
import * as JimpFunctions from "./JimpFunctions"; 

onmessage = function (workerMessage) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = e.target?.result;
        if (!data || !(data instanceof ArrayBuffer)) {
            return;
        }
        // Manipulate images uploaded directly from the website.
        const image = await Jimp.fromBuffer(data);
        workerMessage.data.filters.forEach(f => {
            const Fun = JimpFunctions.FUNCTIONS_HASH[f.name];
            const funObj = f.args != null ? new Fun(f.args) : new Fun();
            funObj.run(image);
        })
        this.postMessage(await image.getBase64("image/png"));
    };
    reader.readAsArrayBuffer(workerMessage.data.blob);
}