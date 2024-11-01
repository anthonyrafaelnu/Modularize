'use client'

import { useState, useEffect } from 'react'

interface ModuleData {
  [key: string]: {
    [key: string]: string[]
  }
}

export default function ModuleRegistry() {
  const [modules, setModules] = useState<ModuleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/json/moduleRegistry')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar el registro de módulos')
        }
        return response.json()
      })
      .then(data => {
        setModules(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center text-2xl text-gray-600">Cargando...</div>
  if (error) return <div className="text-center text-2xl text-red-600">Error: {error}</div>
  if (!modules) return <div className="text-center text-2xl text-gray-600">No hay datos disponibles</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Registro de Módulos</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(modules).map(([moduleType, moduleData]) => (
          <div key={moduleType} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-indigo-600 text-white px-4 py-2">
              <h2 className="text-xl font-semibold">{moduleType}</h2>
            </div>
            <div className="p-4">
              {Object.entries(moduleData).map(([provider, users]) => (
                <div key={provider} className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{provider}</h3>
                  <ul className="list-disc pl-5 text-gray-600">
                    {users.map((user, index) => (
                      <li key={index}>{user}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}