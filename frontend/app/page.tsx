'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function Home() {
  const [uploadStatus, setUploadStatus] = useState<string>('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadStatus('Subiendo archivos...')
    
    const uploadPromises = acceptedFiles.map(async (file) => {
      const response = await fetch('/json/save', {
        method: 'POST',
        body: file,
      })
      
      if (!response.ok) {
        throw new Error(`Error al subir ${file.name}`)
      }
      
      return response.json()
    })
    
    try {
      await Promise.all(uploadPromises)
      setUploadStatus('Todos los archivos se han subido correctamente.')
    } catch (error) {
      setUploadStatus('Hubo un error al subir algunos archivos.')
      console.error(error)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/json': ['.json'] } })

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subir archivos JSON</h1>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-12 mb-8 transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-lg text-gray-600">
          {isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra y suelta archivos JSON aquí, o haz clic para seleccionar archivos'}
        </p>
      </div>
      {uploadStatus && (
        <p className={`mt-4 text-lg ${uploadStatus.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {uploadStatus}
        </p>
      )}
    </div>
  )
}