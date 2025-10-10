'use client'

import { useState } from 'react'
import { 
  CogIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/DashboardLayout'

interface Integration {
  id: string
  name: string
  type: 'jira' | 'github'
  status: 'connected' | 'disconnected' | 'error'
  url?: string
  lastSync?: string
  projects?: number
  repositories?: number
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Company Jira',
    type: 'jira',
    status: 'connected',
    url: 'https://company.atlassian.net',
    lastSync: '2024-01-15T10:30:00Z',
    projects: 12
  },
  {
    id: '2',
    name: 'GitHub Organization',
    type: 'github',
    status: 'connected',
    url: 'https://github.com/company',
    lastSync: '2024-01-15T10:25:00Z',
    repositories: 25
  }
]

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState(mockIntegrations)
  const [showAddIntegration, setShowAddIntegration] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-error-600" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-secondary-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'error':
        return 'Error'
      default:
        return 'Disconnected'
    }
  }

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Settings</h1>
            <p className="text-secondary-600 mt-1">
              Manage your integrations and system preferences
            </p>
          </div>
        </div>

        {/* Integrations Section */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <LinkIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">Integrations</h2>
                <p className="text-sm text-secondary-600">Connect your development tools</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddIntegration(true)}
              className="btn-primary"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Integration
            </button>
          </div>

          <div className="space-y-4">
            {integrations.map((integration) => (
              <div key={integration.id} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {integration.type === 'jira' ? (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">J</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">GH</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">{integration.name}</h3>
                      <p className="text-sm text-secondary-600">{integration.url}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(integration.status)}
                      <span className="text-sm font-medium text-secondary-900">
                        {getStatusText(integration.status)}
                      </span>
                    </div>
                    <button className="text-error-600 hover:text-error-700">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {integration.status === 'connected' && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-secondary-200">
                    <div>
                      <div className="text-sm text-secondary-600">Last Sync</div>
                      <div className="font-medium text-secondary-900">
                        {integration.lastSync ? formatLastSync(integration.lastSync) : 'Never'}
                      </div>
                    </div>
                    {integration.projects && (
                      <div>
                        <div className="text-sm text-secondary-600">Projects</div>
                        <div className="font-medium text-secondary-900">{integration.projects}</div>
                      </div>
                    )}
                    {integration.repositories && (
                      <div>
                        <div className="text-sm text-secondary-600">Repositories</div>
                        <div className="font-medium text-secondary-900">{integration.repositories}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {integrations.length === 0 && (
              <div className="text-center py-12">
                <LinkIcon className="mx-auto h-12 w-12 text-secondary-400" />
                <h3 className="mt-2 text-sm font-semibold text-secondary-900">No integrations</h3>
                <p className="mt-1 text-sm text-secondary-500">
                  Get started by adding your first integration.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddIntegration(true)}
                    className="btn-primary"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Integration
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Integration Modal */}
        {showAddIntegration && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-secondary-900/80" onClick={() => setShowAddIntegration(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Add Integration</h3>
                
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs">J</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-secondary-900">Jira</div>
                        <div className="text-sm text-secondary-600">Connect your Jira projects</div>
                      </div>
                    </div>
                    <PlusIcon className="h-5 w-5 text-secondary-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">GH</span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-secondary-900">GitHub</div>
                        <div className="text-sm text-secondary-600">Connect your GitHub repositories</div>
                      </div>
                    </div>
                    <PlusIcon className="h-5 w-5 text-secondary-400" />
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowAddIntegration(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* General Settings Section */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CogIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-secondary-900">General Settings</h2>
              <p className="text-sm text-secondary-600">Configure your preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-secondary-900">Real-time notifications</h3>
                <p className="text-sm text-secondary-600">Get notified when tasks complete or agents encounter errors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-secondary-900">Auto-sync integrations</h3>
                <p className="text-sm text-secondary-600">Automatically sync data from connected services every hour</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
