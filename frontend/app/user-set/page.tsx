'use client'

import { useState, useEffect } from 'react'

interface UserSet {
  [key: string]: any
}

export default function UserSet() {
  const [userSets, setUserSets] = useState<UserSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/json/userSet')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar los sets de usuarios')
        }
        return response.json()
      })
      .then(data => {
        setUserSets(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center text-2xl text-gray-600">Cargando...</div>
  if (error) return <div className="text-center text-2xl text-red-600">Error: {error}</div>
  if (!userSets) return <div className="text-center text-2xl text-gray-600">No hay datos disponibles</div>

  const renderUserValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ')
    } else if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    } else {
      return String(value)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sets de Usuarios</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuarios
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(userSets).map(([set, users]) => (
              <tr key={set}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {renderUserValue(users)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}