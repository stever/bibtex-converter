import React, {useState} from "react";
import Worker from "../bibtex.worker";
import {CSL} from "../utilities/csl";
import {ConvertToXML} from "../utilities/bib_converter";
import {xmlFormatter} from "../utilities/xml_formatter";

export const Citation = () => {
    const format = 'HTML'
    const innerText = `@book{texbook,
  author = {Donald E. Knuth},
  year = {1986},
  title = {The {\\TeX} Book},
  publisher = {Addison-Wesley Professional}
}`
    const style = 'ieee'

    let [outputText, setOutputText] = useState(undefined)
    const worker = new Worker('./bibtex.worker.js')

    if (innerText.length > 1 && format) {
        const csl = CSL[style] && CSL[style] || localStorage.getItem(style)

        worker.postMessage({input: innerText, format, style, csl})

        worker.onerror = () => {
            setOutputText('')
        }

        worker.onmessage = (e) => {
            const {output, error} = e.data
            if (error) {
                setOutputText('')
            } else {
                if (format === 'XML') {
                    const xml = ConvertToXML(output)
                    setOutputText(xmlFormatter(xml))
                } else {
                    setOutputText(output)
                }
            }
        }
    }

    return (
        <div className="container-fluid">
            <div className={'output-viewer'} dangerouslySetInnerHTML={{__html: outputText}} style={{overflow: 'auto'}}/>
        </div>
    )
}
