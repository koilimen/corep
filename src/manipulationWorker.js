import { manipulate } from "./colorManipulation";
const worker = () => {
    onmessage = (e) => {
        const blobs = e.data;
        const promises = []
        blobs.forEach(blobData => {
            const relPath = blobData.name;
            const blob = blobData.blob;
            const type = relPath.substring(relPath.lastIndexOf('.') + 1);
            promises.push(manipulate(blob, type, (base64ConvertedData) => {
                postMessage([relPath, base64ConvertedData]);
            }));
        });

        Promise.all(promises).then(() => {
            postMessage(null);
        })
    }
}

let code = worker.toString()
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"))
const blob = new Blob([code], { type: 'application/javascript' })
const workerScript = URL.createObjectURL(blob)
export default workerScript;