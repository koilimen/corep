import { Jimp } from "jimp";
import * as JimpFunctions from "./JimpFunctions";

onmessage = function (workerMessage) {
    let cnt = workerMessage.data.blobs.length;
    workerMessage.data.blobs.forEach(blob => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target?.result;
            if (!data || !(data instanceof ArrayBuffer)) {
                return;
            }
            const relPath = blob.relPath;
            let type = relPath.substring(relPath.lastIndexOf('.') + 1);
            // Manipulate images uploaded directly from the website.
            const image = await Jimp.fromBuffer(data);
            workerMessage.data.filters.forEach(f => {
                const Fun = JimpFunctions.FUNCTIONS_HASH[f.name];
                const funObj = f.args != null ? new Fun(f.args) : new Fun();
                funObj.run(image);
            })
            if (type == 'jpg') type = 'jpeg';

            this.postMessage({ blob: await image.getBuffer("image/" + type), relPath: relPath });
            cnt--;
            if(cnt == 0){
                this.postMessage(null);
            }
        };
        reader.readAsArrayBuffer(blob.blob);
    })

}