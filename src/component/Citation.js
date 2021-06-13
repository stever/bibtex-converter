import React, {Fragment, useCallback, useRef, useState} from "react";
import {FormatGroup} from "./Format/FormatGroup";
import {TextEditor} from "./TextEditor";
import UseCite from '../hooks/cite'

import {FormatLabel} from "./Format/FormatLabel";
import {FormatEncoder} from "./Format/FormatEncoder";
import {ConversionControls} from "./ConversionControls";
import {CSL} from "../utilities/csl";
import {CustomStyle} from "./CustomStyle";

export const Citation = () => {
  const editorRef = useRef()
  const uploadRef = useRef()

  const [format, setFormat] = useState(undefined)
  const [innerText, setInnerText] = useState('')
  const [style, setStyle] = useState('apa')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(false)
  const [fileName, setFileName] = useState('untitled')

  const {outputText, outputError, outputLoading} = UseCite(innerText,format, style)

  const onTextChangeHandler = useCallback((event) => {
      if (uploadProgress !== 0 || uploadError){
          setUploadProgress(0)
          setUploadError(false)
      }
      setInnerText(event.target.value)
  }, [uploadProgress, uploadError])

  const onClearClickHandler = useCallback(() => {
      editorRef.current.value = ''
      uploadRef.current.value = null
      setInnerText('')
      setUploadProgress(0)
      setUploadError(false)
      setFormat(undefined)
  },[])

  const onFileUpload = useCallback((event) => {
      try {
          //Clear text
          editorRef.current.value = ''
          setInnerText('')

          const file = event.target.files[0]
          if (file.size > 25431761){
              setUploadError('siz_limit')
              return
          }
          // eslint-disable-next-line no-undef
          const fileReader = new FileReader()

          fileReader.onloadend = () => setInnerText(fileReader.result)

          fileReader.onprogress = (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))

          fileReader.onerror = () => setUploadError(true)

          fileReader.readAsText(file)
      } catch (e) {
          setUploadError(true)
      }
  },[])

  const onDownloadClickHandler = useCallback(async (event) => {
      if (format && innerText.length > 1 && !outputError){
          if (format === 'PDF'){
              const element = document.getElementsByClassName('output-viewer')[0].cloneNode(true);
              element.style.width = '648px';
              element.style.padding = '12px';

              const style = `.csl-bib-body div:nth-child(10n){ margin-bottom: 300px; }`
              const styleSheet = document.createElement('style')
              styleSheet.innerText = style
              element.appendChild(styleSheet)

              const {jsPDF} = await import(/* webpackChunkName: "jsPDF" */'jspdf');
              const doc = new jsPDF('p', 'px', 'a4')
              doc.html(element, {
                  callback: function (doc) {
                      doc.setFontSize(12)
                      doc.save(fileName);
                  },
                  html2canvas: {
                      scale: 0.65
                  },
                  x: 25,
                  y: 50,
              })
          } else {
              const link = document.createElement('a');
              if (format === 'WORD'){
                  const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
                      "xmlns:w='urn:schemas-microsoft-com:office:word' "+
                      "xmlns='http://www.w3.org/TR/REC-html40'>"+
                      "<head><meta charset='utf-8'></head><body>";
                  const footer = "</body></html>";
                  const source = header + outputText + footer
                  link.href = `data:${FormatEncoder[format].fileType};charset=UTF-8,` + encodeURIComponent(source)
              } else {
                  link.href = `data:${FormatEncoder[format].fileType};charset=UTF-8,` + encodeURIComponent(outputText);
              }
              link.download = `${fileName}.${FormatEncoder[format].name}`;
              link.click();
          }
      }
  },[format, outputText, fileName, innerText, outputError])

  const handleOnStyleClick = useCallback((event) => setStyle(event.target.id),[])

  const onFileNameChange = useCallback((event) => setFileName(event.target.value), [setFileName])

  const onClipboardClick = useCallback((event) => {
      if (outputText && outputText.length > 1 && !outputError) {
          const toast = document.getElementById("snackbar");
          toast.className = "show";
          (async () =>{ await navigator.clipboard.writeText(outputText)})()
          setTimeout(function(){
              toast.className = toast.className.replace("show", "");
          }, 3000);
      }
  },[outputText, outputError])

  return(
      <div className="container-fluid">
          <FormatGroup format={format} setFormat={setFormat}/>

          {/* Text editor */}
          <div className="mb-3 py-3">
              {format && <FormatLabel format={format}/>}

              <TextEditor editorRef={editorRef} format={format} onTextChangeHandler={onTextChangeHandler}/>
          </div>

          {/* Upload Handler */}
          <div className="mb-3 py-3">
              {format && <FormatLabel format={format} uploadMessage={true}/>}
              <input ref={uploadRef} className="form-control" type="file" id="formFile" accept={'.bib, .json'} onChange={onFileUpload}/>
              {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="progress" style={{marginTop: '10px'}}>
                      <div className="progress-bar" role="progressbar" style={{width: `${uploadProgress}%`}} aria-valuenow="25"
                           aria-valuemin="0" aria-valuemax="100">{uploadProgress}%
                      </div>
                  </div>
              )}
              {uploadProgress === 100 && (
                  <span className="badge bg-success" style={{marginTop: '10px'}}>Uploaded</span>
              )}
              {uploadError && (<span className="badge bg-danger" style={{marginTop: '25px'}}>
                  {typeof uploadError === 'string' && 'File size should be lees then 24 MB ⚠' || 'Unable to upload your file ⚠'}
              </span>)}
          </div>

          {/* Conversion Control */}
         <ConversionControls onDownloadClickHandler={onDownloadClickHandler}
                             onClearClickHandler={onClearClickHandler}
                             onFileNameChange={onFileNameChange}
                             onClipboardClick={onClipboardClick}
         />

          {/*  Output Viewer  */}
          {outputLoading && (
              <div className="spinner-grow text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
              </div>
          )}
          {outputError && (<span className="mb-2 badge bg-danger">sorry we are unable to convert your input ⚠️</span>)}
          <div>
              {format !== 'XML' && format !== 'BIB' && format !== 'RIS' && <div className="h-100 bg-light">
                      <h3>Citation Style/Templates</h3>
                      <div className="btn-group d-flex flex-wrap" role="group" aria-label="Basic checkbox toggle button group">
                          {Object.keys(CSL).map(csl => (
                              <Fragment key={csl}>
                                  <input checked={style === csl} type="checkbox" className="btn-check" id={csl} autoComplete="off"
                                         onChange={handleOnStyleClick}/>
                                  <label className="btn btn-outline-primary" htmlFor={csl}>{csl}</label>
                              </Fragment>
                          ))}
                      </div>
                      <CustomStyle style={style} handleOnStyleClick={handleOnStyleClick}/>
              </div>}
              <div className="h-100 bg-light py-4">
                  <h6>Conversion Result</h6>
                  <div className="h-100 p-5 bg-light border rounded-3">
                      {(format === 'XML' || format === 'BIB' || format === 'RIS') ?
                      <textarea readOnly style={{background: '#f8f9fa', width: '100%', height: '500px', resize: 'none', border: 'none'}} value={outputText}/> :
                      <div className={'output-viewer'} dangerouslySetInnerHTML={{ __html: outputText }} style={{overflow: 'auto'}}/>
                      }
                  </div>
              </div>
          </div>
      </div>
  )
}
