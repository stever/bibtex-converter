import React from "react";
import UseCite from '../hooks/cite'

export const Citation = () => {
  const format = 'HTML'
  const innerText = `@book{texbook,
  author = {Donald E. Knuth},
  year = {1986},
  title = {The {\\TeX} Book},
  publisher = {Addison-Wesley Professional}
}`
  const style = 'ieee'

  const {outputText, outputError, outputLoading} = UseCite(innerText,format, style)

  return(
      <div className="container-fluid">
          <div className={'output-viewer'} dangerouslySetInnerHTML={{ __html: outputText }} style={{overflow: 'auto'}}/>
      </div>
  )
}
