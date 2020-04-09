import React, { useState, useEffect } from 'react'
import { retrieveData, Paper } from './lib'

export function Component() {
  const [data, setData] = useState<Paper[]>([])
  console.log('data', data)

  useEffect(() => {
    retrieveData().then(d => setData(d))
  }, [])

  return (
    <div className="w-100 h-100 flex items-center justify-around">
      <div>ciao</div>
    </div>
  )
}
