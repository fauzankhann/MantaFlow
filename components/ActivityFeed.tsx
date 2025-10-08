'use client'

import { 
  CheckCircleIcon, 
  PlayIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'

interface Activity {
  id: string
  type: 'task_completed' | 'task_started' | 'error' | 'integration_sync' | 'code_change'
  message: string
  agent: string
  timestamp: string
  details?: {
    repository?: string
    branch?: string
    linesChanged?: number
    error?: string
    source?: string
    items?: number
  }
}

interface ActivityFeedProps {
  activities: Activity[]
}

const activityTypeConfig = {
  task_completed: {
    icon: CheckCircleIcon,
    color: 'text-success-600',
    bgColor: 'bg-success-100'
  },
  task_started: {
    icon: PlayIcon,
    color: 'text-primary-600',
    bgColor: 'bg-primary-100'
  },
  error: {
    icon: ExclamationTriangleIcon,
    color: 'text-error-600',
    bgColor: 'bg-error-100'
  },
  integration_sync: {
    icon: ArrowPathIcon,
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100'
  },
  code_change: {
    icon: CodeBracketIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
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

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="text-secondary-400 mb-2">
          <ArrowPathIcon className="h-8 w-8 mx-auto" />
        </div>
        <p className="text-secondary-600">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const config = activityTypeConfig[activity.type]
          const ActivityIcon = config.icon
          
          return (
            <div key={activity.id} className="flex space-x-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center`}>
                <ActivityIcon className={`h-4 w-4 ${config.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm text-secondary-900">
                  {activity.message}
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs text-secondary-500">
                    {activity.agent} • {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
                
                {activity.details && (
                  <div className="mt-2 text-xs text-secondary-600">
                    {activity.details.repository && activity.details.branch && (
                      <div className="flex items-center space-x-2">
                        <span className="bg-secondary-100 px-2 py-1 rounded">
                          {activity.details.repository}/{activity.details.branch}
                        </span>
                        {activity.details.linesChanged && (
                          <span>+{activity.details.linesChanged} lines</span>
                        )}
                      </div>
                    )}
                    
                    {activity.details.error && (
                      <div className="text-error-600 bg-error-50 px-2 py-1 rounded mt-1">
                        {activity.details.error}
                      </div>
                    )}
                    
                    {activity.details.source && activity.details.items && (
                      <div className="flex items-center space-x-2">
                        <span className="bg-secondary-100 px-2 py-1 rounded">
                          {activity.details.source}
                        </span>
                        <span>{activity.details.items} items</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-secondary-200">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  )
}
