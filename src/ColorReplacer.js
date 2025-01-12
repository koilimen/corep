import { useState } from "react";
import { manipulate } from "./colorManipulation";
import JSZip from "jszip";
import { Jimp } from "jimp";
import * as JimpFunctions from "./JimpFunctions";

export function ColorReplacer() {
    const [zip, setZip] = useState(null);
    const [result, setResult] = useState(null);
    const [blob, setBlob] = useState(null);
    const [exampleImage, setExampleImage] = useState(null);
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const FILEINPUT_CLASSNAME = "block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
    function onChange(e) {
        e.target.files[0].arrayBuffer()
            .then(data => {
                const jsZip = new JSZip()
                jsZip.loadAsync(data)
                    .then((loadedZip) => {
                        setZip(loadedZip);
                        loadedZip.forEach((path, zipObject) => {
                            if (exampleImage == null) {
                                if (zipObject.dir === false) {
                                    zipObject.async('blob')
                                        .then(blob => {
                                            setBlob(blob);
                                            setExampleImage(URL.createObjectURL(blob));
                                        })
                                }
                            }
                        });
                    })
            })
    }
    function convert(e) {
        e.preventDefault();
        const newZip = new JSZip();
        setLoading(true)
        const promises = []
        zip.forEach((relPath, zipObject) => {
            const type = relPath.substring(relPath.lastIndexOf('.') + 1);
            const prom = zipObject.async('blob');
            promises.push(prom);
            prom.then(blob => {
                manipulate(blob, type, (base64ConvertedData) => {
                    newZip.file(relPath, base64ConvertedData);
                })
            })
        });

        Promise.all(promises).then(() => {
            newZip.generateAsync({ type: 'base64' })
                .then((data) => setResult("data:image/png;base64," + data));
            setLoading(false);

        })

    }
    function onFilterChange(filters) {
        const worker = new Worker(new URL("./manipulationWorker", import.meta.url));
        worker.postMessage({
            blob: blob,
            filters: filters
        })
        worker.onmessage = function (e) {
            setOutput(e.data)
        }
        console.log("on filter change")
    }

    return (
        <div className="container mx-auto">
            <h1 className="my-3">Замена Цвета</h1>
            <form onSubmit={convert}>
                <input type="file" onChange={onChange}
                    name="file" className={FILEINPUT_CLASSNAME} />
                <button className="my-5 bg-yellow-200 hover:bg-yellow-300 px-4 py-2 rounded-lg " >Поехали</button>
            </form>
            {exampleImage && <Controls onFilterChange={onFilterChange} />}
            {exampleImage && <ExampleImage src={exampleImage} output={output} />}
            {loading && <Spinner />}
            {result != null && <DownloadRow result={result} />}
        </div>
    )
}

function Controls({ onFilterChange }) {
    const [filters, setFilters] = useState([]);
    const [blurRadius, setBlurRadius] = useState(3);

    function commonToggle(e, filterData) {
        let newFilters;
        if (e.target.checked) {
            newFilters = filters.slice();
            newFilters.push(filterData)
        } else {
            newFilters = filters.filter(f => f.name !== filterData.name)
        }
        setFilters(newFilters)
        onFilterChange(newFilters)
    }
    function grayscaleToggle(e) {
        commonToggle(e, { name: JimpFunctions.Grayscale.name })
    }
    function handleBlur(e) {
        commonToggle(e, { name: JimpFunctions.Blur.name, args: { radius: blurRadius } })
    }
    function handleBlurRadius(e) {
        const newRadius = parseInt(e.target.value);
        setBlurRadius(newRadius);

        const newFilters = filters.filter(f => f.name !== JimpFunctions.Blur.name);
        if (newRadius > 0) newFilters.push({ name: JimpFunctions.Blur.name, args: { radius: newRadius } })
        setFilters(newFilters)
        onFilterChange(newFilters);
    }
    return (
        <>
            <div>
                <input type="checkbox" id="grayscale" name="grayscale" onChange={grayscaleToggle} />
                <label htmlFor="grayscale">Сделать серым</label>
            </div>
            <div>
                <input type="checkbox" id="blur" name="blur" onChange={handleBlur} />
                <label htmlFor="blur">Размытие</label>
                <input type="number" value={blurRadius} id="blurRadius" onChange={handleBlurRadius}></input>
            </div>
        </>
    )
}

function ExampleImage({ src, output }) {
    return (
        <div className="columns-2">
            <div className="w-full">
                <span>До</span>
                <img className="w-full" src={src} />
            </div>
            <div className="w-full">
                <span>После</span>
                {output && <img className="w-full" src={output} />}
            </div>
        </div>
    )
}


function Spinner() {
    return (
        <div role="status " >
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    )
}
function DownloadRow({ result }) {
    return (
        <p>Готово! Можно <a href={result}
            className="my-5 bg-yellow-200 hover:bg-yellow-300 px-4 py-2 rounded-lg "
            download="new_images.zip">
            скачать
        </a>
        </p>
    )
}