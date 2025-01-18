import { Download } from 'lucide-react'
import React from 'react'

const area_improvement = () => {
  return (
    <div className="flex w-full h-auto py-3 px-5 rounded-xl border shadow-lg">
      <div className="flex flex-row w-full items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-violet-800">
          Areas for Improvement
          </h1>
          <span className="text-sm font-thin text-zinc-600">
          Current performance vs target metrics
          </span>
        </div>
        <button className="flex-row flex gap-3 items-center bg-black hover:bg-slate-600 transition-all duration-200 text-white text-sm py-2 px-3 rounded-xl">
          Export
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default area_improvement