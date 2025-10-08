'use client'

import Link from 'next/link'
import { 
  CodeBracketIcon, 
  BugAntIcon, 
  CogIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

interface EnhancedTask {
  id: string
  title: string
  type: 'code_review' | 'bug_fix' | 'feature_development' | 'testing'
  status: 'pending' | 'in_progress' | 'completed' | 'error'
  progress: number
  agent: string
  repository: string
  branch: string
  createdAt: string
  completedAt?: string
  estimatedCompletion?: string
  error?: string
  language: string
  framework: string
  jiraIssue?: {
    key: string
    summary: string
    status: string
    assignee?: string
    priority: 'Low' | 'Medium' | 'High' | 'Critical'
  }
  bitbucket?: {
    commitHash?: string
    commitMessage?: string
    pullRequestId?: string
    pullRequestStatus?: 'open' | 'merged' | 'declined'
    author?: string
  }
}

interface EnhancedTaskCardProps {
  task: EnhancedTask
}

const taskTypeConfig = {
  code_review: {
    icon: CodeBracketIcon,
    label: 'Code Review',
    color: 'bg-blue-100 text-blue-800'
  },
  bug_fix: {
    icon: BugAntIcon,
    label: 'Bug Fix',
    color: 'bg-red-100 text-red-800'
  },
  feature_development: {
    icon: CogIcon,
    label: 'Feature',
    color: 'bg-green-100 text-green-800'
  },
  testing: {
    icon: ShieldCheckIcon,
    label: 'Testing',
    color: 'bg-purple-100 text-purple-800'
  }
}

const statusConfig = {
  pending: {
    icon: ClockIcon,
    label: 'Pending',
    color: 'text-secondary-500'
  },
  in_progress: {
    icon: PlayIcon,
    label: 'In Progress',
    color: 'text-primary-600'
  },
  completed: {
    icon: CheckCircleIcon,
    label: 'Completed',
    color: 'text-success-600'
  },
  error: {
    icon: ExclamationTriangleIcon,
    label: 'Error',
    color: 'text-error-600'
  }
}

const priorityConfig = {
  Low: 'bg-gray-100 text-gray-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-orange-100 text-orange-800',
  Critical: 'bg-red-100 text-red-800'
}

const prStatusConfig = {
  open: 'bg-blue-100 text-blue-800',
  merged: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800'
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

function formatEstimatedTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60))
  
  if (diffInMinutes <= 0) return 'Overdue'
  if (diffInMinutes < 60) return `${diffInMinutes}m remaining`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h remaining`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d remaining`
}

export default function EnhancedTaskCard({ task }: EnhancedTaskCardProps) {
  const typeConfig = taskTypeConfig[task.type]
  const statusConfig_ = statusConfig[task.status]
  const TypeIcon = typeConfig.icon
  const StatusIcon = statusConfig_.icon

  return (
    <Link href={`/dashboard/tasks/${task.id}`} className="block">
      <div className="card-hover">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <TypeIcon className="h-5 w-5 text-secondary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-secondary-900 truncate">
                {task.title}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
                <span className="text-sm text-secondary-500">
                  {task.repository}/{task.branch}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <StatusIcon className={`h-5 w-5 ${statusConfig_.color}`} />
            <span className={`text-sm font-medium ${statusConfig_.color}`}>
              {statusConfig_.label}
            </span>
          </div>
        </div>

        {/* Jira Integration */}
        {task.jiraIssue && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-900">🔷 Jira Issue</span>
                <a 
                  href={`#`} 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  {task.jiraIssue.key}
                  <ArrowTopRightOnSquareIcon className="h-3 w-3 inline ml-1" />
                </a>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[task.jiraIssue.priority]}`}>
                {task.jiraIssue.priority}
              </span>
            </div>
            <p className="text-sm text-blue-800 truncate">{task.jiraIssue.summary}</p>
            <div className="flex items-center justify-between mt-2 text-xs text-blue-700">
              <span>Status: {task.jiraIssue.status}</span>
              {task.jiraIssue.assignee && <span>Assignee: {task.jiraIssue.assignee}</span>}
            </div>
          </div>
        )}

        {/* Bitbucket Integration */}
        {task.bitbucket && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">🪣 Bitbucket</span>
              {task.bitbucket.pullRequestId && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${prStatusConfig[task.bitbucket.pullRequestStatus || 'open']}`}>
                  PR #{task.bitbucket.pullRequestId} - {task.bitbucket.pullRequestStatus}
                </span>
              )}
            </div>
            {task.bitbucket.commitHash && (
              <div className="text-xs text-blue-700 mb-1">
                <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                  {task.bitbucket.commitHash.substring(0, 8)}
                </span>
                {task.bitbucket.author && <span className="ml-2">by {task.bitbucket.author}</span>}
              </div>
            )}
            {task.bitbucket.commitMessage && (
              <p className="text-sm text-blue-800 truncate">{task.bitbucket.commitMessage}</p>
            )}
          </div>
        )}

        {/* Progress bar */}
        {task.status === 'in_progress' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-secondary-600">Progress</span>
              <span className="font-medium text-secondary-900">{task.progress}%</span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error message */}
        {task.status === 'error' && task.error && (
          <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
            <p className="text-sm text-error-700">{task.error}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-secondary-600">
          <div className="flex items-center space-x-4">
            <span>Agent: {task.agent}</span>
            <span>{task.language}</span>
            <span>{task.framework}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {task.status === 'completed' && task.completedAt && (
              <span>Completed {formatTimeAgo(task.completedAt)}</span>
            )}
            {task.status === 'in_progress' && task.estimatedCompletion && (
              <span>{formatEstimatedTime(task.estimatedCompletion)}</span>
            )}
            {task.status === 'pending' && (
              <span>Created {formatTimeAgo(task.createdAt)}</span>
            )}
            {task.status === 'error' && (
              <span>Failed {formatTimeAgo(task.createdAt)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
