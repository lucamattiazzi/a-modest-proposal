import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Component as Samples } from './samples/Component'
import { Component as Pool } from './pool/Component'
import { Component as Papers } from './papers/Component'
import 'modern-normalize'
import 'tachyons'
import 'tachyons-extra'
import './reset.css'
import './style.css'

const routes = {
  samples: Samples,
  pool: Pool,
  papers: Papers,
}

interface RouteProps {
  navigateTo: (path: string) => void
}

function getCurrentRoute(): string {
  const { hash } = window.location
  const hashKey = hash.replace('#', '')
  const route = hashKey in routes ? hashKey : ''
  return route
}

function Home(p: RouteProps) {
  return (
    <div className="w-100 h-100 flex flex-column items-center justify-center">
      {Object.keys(routes).map(k => (
        <div className="pointer pb3 f3" onClick={() => p.navigateTo(k)} key={k}>
          Go to <b>{k}</b>
        </div>
      ))}
    </div>
  )
}

function App() {
  const baseRoute = getCurrentRoute()
  const [route, setRoute] = useState(baseRoute)

  function navigateTo(path: string) {
    window.location.hash = path
    setRoute(path)
  }

  window.onhashchange = () => {
    const newPath = getCurrentRoute()
    navigateTo(newPath)
  }

  function goHome() {
    navigateTo('')
  }

  const Component = routes[route] || Home
  return (
    <div className="w-100 h-100 relative">
      <Component navigateTo={navigateTo} />
      <div className="absolute top-1 right-1 pointer" onClick={goHome}>
        Go Home
      </div>
    </div>
  )
}

function renderApp() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp()
