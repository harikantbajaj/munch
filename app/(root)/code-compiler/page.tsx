'use client'

import React from 'react'
import CodeCompiler from '@/app/Components/CodeCompiler'

const CodeCompilerPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">Code Compiler</h1>
        <p className="text-center text-gray-600 mb-6">
          Write, compile, and test your code in multiple programming languages
        </p>
      </div>
      <CodeCompiler />
    </div>
  )
}

export default CodeCompilerPage
