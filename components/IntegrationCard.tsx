'use client'

import { useState } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  LinkIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Integration {
  id: string
  name: string
  type: 'jira' | 'bitbucket' | 'github' | 'gitlab'
  status: 'connected' | 'disconnected' | 'error'
  lastSync?: string
  account?: string
  projects?: number
  repositories?: number
  errorMessage?: string
}

interface IntegrationCardProps {
  integration: Integration
  onConnect: (id: string) => void
  onDisconnect: (id: string) => void
  onConfigure: (id: string) => void
}

const integrationConfig = {
  jira: {
    name: 'Jira',
    icon: '🔷',
    color: 'bg-blue-100 text-blue-800',
    description: 'Project management and issue tracking'
  },
  bitbucket: {
    name: 'Bitbucket',
    icon: '🪣',
    color: 'bg-blue-100 text-blue-800',
    description: 'Git repository hosting and CI/CD'
  },
  github: {
    name: 'GitHub',
    icon: '🐙',
    color: 'bg-gray-100 text-gray-800',
    description: 'Git repository hosting and collaboration'
  },
  gitlab: {
    name: 'GitLab',
    icon: '🦊',
    color: 'bg-orange-100 text-orange-800',
    description: 'DevOps platform and Git repository'
  }
}

const statusConfig = {
  connected: {
    icon: CheckCircleIcon,
    label: 'Connected',
    color: 'text-success-600',
    bgColor: 'bg-success-100'
  },
  disconnected: {
    icon: XCircleIcon,
    label: 'Disconnected',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-100'
  },
  error: {
    icon: ExclamationTriangleIcon,
    label: 'Error',
    color: 'text-error-600',
    bgColor: 'bg-error-100'
  }
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

export default function IntegrationCard({ 
  integration, 
  onConnect, 
  onDisconnect, 
  onConfigure 
}: IntegrationCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const config = integrationConfig[integration.type]
  const statusConf = statusConfig[integration.status]
  const StatusIcon = statusConf.icon

  const handleAction = async (action: 'connect' | 'disconnect' | 'configure') => {
    setIsLoading(true)
    try {
      switch (action) {
        case 'connect':
          await onConnect(integration.id)
          break
        case 'disconnect':
          await onDisconnect(integration.id)
          break
        case 'configure':
          await onConfigure(integration.id)
          break
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{config.icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">{config.name}</h3>
            <p className="text-sm text-secondary-600">{config.description}</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConf.bgColor}`}>
          <StatusIcon className={`h-4 w-4 ${statusConf.color}`} />
          <span className={`text-sm font-medium ${statusConf.color}`}>
            {statusConf.label}
          </span>
        </div>
      </div>

      {integration.status === 'connected' && (
        <div className="mb-4 space-y-2">
          {integration.account && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-600">Account</span>
              <span className="font-medium text-secondary-900">{integration.account}</span>
            </div>
          )}
          
          {integration.projects && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-600">Projects</span>
              <span className="font-medium text-secondary-900">{integration.projects}</span>
            </div>
          )}
          
          {integration.repositories && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-600">Repositories</span>
              <span className="font-medium text-secondary-900">{integration.repositories}</span>
            </div>
          )}
          
          {integration.lastSync && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-600">Last Sync</span>
              <span className="font-medium text-secondary-900">
                {formatTimeAgo(integration.lastSync)}
              </span>
            </div>
          )}
        </div>
      )}

      {integration.status === 'error' && integration.errorMessage && (
        <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
          <p className="text-sm text-error-700">{integration.errorMessage}</p>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {integration.status === 'disconnected' && (
          <button
            onClick={() => handleAction('connect')}
            disabled={isLoading}
            className="flex-1 btn-primary text-sm py-2"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        )}
        
        {integration.status === 'connected' && (
          <>
            <button
              onClick={() => handleAction('configure')}
              disabled={isLoading}
              className="flex-1 btn-secondary text-sm py-2"
            >
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Configure
            </button>
            <button
              onClick={() => handleAction('disconnect')}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-error-600 hover:text-error-700 border border-error-300 hover:border-error-400 rounded-lg transition-colors"
            >
              Disconnect
            </button>
          </>
        )}
        
        {integration.status === 'error' && (
          <button
            onClick={() => handleAction('connect')}
            disabled={isLoading}
            className="flex-1 btn-primary text-sm py-2"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            {isLoading ? 'Reconnecting...' : 'Reconnect'}
          </button>
        )}
      </div>
    </div>
  )
}
