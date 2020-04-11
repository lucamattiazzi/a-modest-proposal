import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { App } from './pool/App'
import 'modern-normalize'
import 'tachyons'
import 'js-frood'
import 'tachyons-extra'
import './reset.css'
import './style.css'
import { FIRST_VISIT_KEY } from './pool/constants'
import GithubCorner from 'react-github-corner'

const ReactMarkdown = require('react-markdown')
const { default: readme } = require('../README.md')

const readmeFinalParagraph = `\n## Now What\nIf you've read till here, click on the top right corner X.\nAs a prize for your patience, try to write the word for 'A big, dumb, balding North American ape with no chin and a short temper' (all lowercase).`

const firstVisit = localStorage.getItem(FIRST_VISIT_KEY)
if (!firstVisit) {
  localStorage.setItem(FIRST_VISIT_KEY, 'true')
}

function Info() {
  return (
    <div className="absolute top-0 left-0 w-100 h-100 bg-white-90 flex justify-center items-center">
      <div className="w-90 h-90 overflow-y-auto bg-white pa4">
        <ReactMarkdown source={readme + readmeFinalParagraph} />
      </div>
    </div>
  )
}

function Main() {
  const [showInfo, setShowInfo] = useState(!firstVisit)

  function toggleShowInfo() {
    setShowInfo(!showInfo)
  }

  return (
    <div className="w-100 h-100 relative">
      <App />
      {showInfo && <Info />}
      <div className="absolute top-2 right-2 pointer f1 monospace" onClick={toggleShowInfo}>
        {showInfo ? 'X' : 'i'}
      </div>
      <GithubCorner
        href="https://github.com/lucamattiazzi/a-modest-proposal"
        size={100}
        direction="left"
      />
    </div>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
