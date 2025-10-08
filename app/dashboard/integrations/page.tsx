'use client'

import { useState } from 'react'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  LinkIcon,
  ClockIcon,
  DocumentTextIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/DashboardLayout'
import toast from 'react-hot-toast'

// Mock data for integrations
const integrations = [
  {
    id: 'jira',
    name: 'Jira',
    description: 'Connect with Jira to sync issues and trigger AI agents from tickets',
    icon: '🔵',
    status: 'connected',
    lastSync: '2024-01-15T10:30:00Z',
    config: {
      serverUrl: 'https://mycompany.atlassian.net',
      project: 'PROJ',
      username: 'john.doe@company.com'
    },
    stats: {
      issuesSync: 45,
      tasksTriggered: 12,
      lastSyncItems: 5
    }
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    description: 'Monitor repositories, branches, and commits for AI agent tasks',
    icon: '🔷',
    status: 'connected',
    lastSync: '2024-01-15T10:25:00Z',
    config: {
      workspace: 'mycompany',
      repositories: ['frontend-app', 'backend-api', 'auth-service']
    },
    stats: {
      repositories: 3,
      branches: 15,
      commits: 127
    }
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Alternative Git provider for repository management',
    icon: '⚫',
    status: 'available',
    lastSync: null,
    config: null,
    stats: null
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and updates about AI agent activities',
    icon: '💬',
    status: 'available',
    lastSync: null,
    config: null,
    stats: null
  }
]

const mockJiraIssues = [
  {
    key: 'PROJ-123',
    summary: 'Implement user authentication system',
    status: 'In Progress',
    assignee: 'John Doe',
    priority: 'High',
    created: '2024-01-14T09:00:00Z'
  },
  {
    key: 'PROJ-124',
    summary: 'Fix memory leak in data processing',
    status: 'To Do',
    assignee: 'Jane Smith',
    priority: 'Critical',
    created: '2024-01-14T11:30:00Z'
  },
  {
    key: 'PROJ-125',
    summary: 'Add unit tests for API endpoints',
    status: 'Done',
    assignee: 'Bob Wilson',
    priority: 'Medium',
    created: '2024-01-13T14:15:00Z'
  }
]

const mockBitbucketData = [
  {
    repository: 'frontend-app',
    branch: 'feature/auth-system',
    lastCommit: {
      hash: 'a1b2c3d',
      message: 'Add login form validation',
      author: 'John Doe',
      timestamp: '2024-01-15T09:45:00Z'
    }
  },
  {
    repository: 'backend-api',
    branch: 'hotfix/memory-leak',
    lastCommit: {
      hash: 'e4f5g6h',
      message: 'Fix memory leak in data processor',
      author: 'Jane Smith',
      timestamp: '2024-01-15T08:30:00Z'
    }
  },
  {
    repository: 'auth-service',
    branch: 'feature/oauth-providers',
    lastCommit: {
      hash: 'i7j8k9l',
      message: 'Add Google OAuth integration',
      author: 'Bob Wilson',
      timestamp: '2024-01-14T16:20:00Z'
    }
  }
]

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

export default function IntegrationsPage() {
  const [syncing, setSyncing] = useState<string | null>(null)

  const handleSync = async (integrationId: string) => {
    setSyncing(integrationId)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success(`${integrations.find(i => i.id === integrationId)?.name} synced successfully!`)
    setSyncing(null)
  }

  const handleConnect = async (integrationId: string) => {
    // Simulate OAuth flow
    toast.success(`Redirecting to ${integrations.find(i => i.id === integrationId)?.name} authentication...`)
  }

  const handleTriggerAgent = async (issueKey: string) => {
    toast.success(`AI agent task created for ${issueKey}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Integrations</h1>
          <p className="text-secondary-600 mt-1">
            Connect your development tools to supercharge your AI agents
          </p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-secondary-600">
                      {integration.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {integration.status === 'connected' ? (
                    <>
                      <CheckCircleIcon className="h-5 w-5 text-success-600" />
                      <span className="text-sm font-medium text-success-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <ExclamationTriangleIcon className="h-5 w-5 text-secondary-400" />
                      <span className="text-sm font-medium text-secondary-500">Available</span>
                    </>
                  )}
                </div>
              </div>

              {integration.status === 'connected' && integration.config && (
                <div className="mb-4 p-3 bg-secondary-50 rounded-lg">
                  <div className="text-sm space-y-1">
                    {integration.id === 'jira' && (
                      <>
                        <div><strong>Server:</strong> {integration.config.serverUrl}</div>
                        <div><strong>Project:</strong> {integration.config.project}</div>
                        <div><strong>User:</strong> {integration.config.username}</div>
                      </>
                    )}
                    {integration.id === 'bitbucket' && (
                      <>
                        <div><strong>Workspace:</strong> {integration.config.workspace}</div>
                        <div><strong>Repositories:</strong> {integration.config.repositories?.join(', ')}</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {integration.status === 'connected' && integration.stats && (
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {integration.id === 'jira' && (
                      <>
                        <div>
                          <div className="text-lg font-bold text-secondary-900">{integration.stats.issuesSync}</div>
                          <div className="text-xs text-secondary-600">Issues</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-secondary-900">{integration.stats.tasksTriggered}</div>
                          <div className="text-xs text-secondary-600">Tasks</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-secondary-900">{integration.stats.lastSyncItems}</div>
                          <div className="text-xs text-secondary-600">Last Sync</div>
                        </div>
                      </>
                    )}
                    {integration.id === 'bitbucket' && (
                      <>
                        <div>
                          <div className="text-lg font-bold text-secondary-900">{integration.stats.repositories}</div>
                          <div className="text-xs text-secondary-600">Repos</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-secondary-900">{integration.stats.branches}</div>
                          <div className="text-xs text-secondary-600">Branches</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-secondary-900">{integration.stats.commits}</div>
                          <div className="text-xs text-secondary-600">Commits</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                {integration.status === 'connected' && integration.lastSync && (
                  <span className="text-sm text-secondary-500">
                    Last sync: {formatTimeAgo(integration.lastSync)}
                  </span>
                )}
                
                <div className="flex items-center space-x-2">
                  {integration.status === 'connected' ? (
                    <button
                      onClick={() => handleSync(integration.id)}
                      disabled={syncing === integration.id}
                      className="btn-secondary text-sm flex items-center"
                    >
                      {syncing === integration.id ? (
                        <div className="loading-dots mr-2">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      ) : (
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                      )}
                      Sync
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.id)}
                      className="btn-primary text-sm flex items-center"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Jira Issues */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Jira Issues</h2>
            <button className="btn-secondary text-sm">
              View All Issues
            </button>
          </div>
          
          <div className="space-y-4">
            {mockJiraIssues.map((issue) => (
              <div key={issue.key} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="h-5 w-5 text-secondary-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-secondary-900">{issue.key}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        issue.priority === 'Critical' ? 'bg-error-100 text-error-800' :
                        issue.priority === 'High' ? 'bg-warning-100 text-warning-800' :
                        'bg-secondary-100 text-secondary-800'
                      }`}>
                        {issue.priority}
                      </span>
                    </div>
                    <p className="text-sm text-secondary-600">{issue.summary}</p>
                    <div className="flex items-center space-x-4 text-xs text-secondary-500 mt-1">
                      <span>Assignee: {issue.assignee}</span>
                      <span>Status: {issue.status}</span>
                      <span>Created: {formatTimeAgo(issue.created)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleTriggerAgent(issue.key)}
                  className="btn-primary text-sm flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Trigger Agent
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bitbucket Repositories */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Commits</h2>
            <button className="btn-secondary text-sm">
              View All Repositories
            </button>
          </div>
          
          <div className="space-y-4">
            {mockBitbucketData.map((repo, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <CodeBracketIcon className="h-5 w-5 text-secondary-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-secondary-900">{repo.repository}</span>
                      <span className="text-sm text-secondary-500">/{repo.branch}</span>
                    </div>
                    <p className="text-sm text-secondary-600">{repo.lastCommit.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-secondary-500 mt-1">
                      <span>Hash: {repo.lastCommit.hash}</span>
                      <span>Author: {repo.lastCommit.author}</span>
                      <span>{formatTimeAgo(repo.lastCommit.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <button className="btn-ghost text-sm">
                    View Branch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
