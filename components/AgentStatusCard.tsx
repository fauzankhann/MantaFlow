'use client'

import { 
  PlayIcon, 
  PauseIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

interface Agent {
  id: string
  name: string
  status: 'active' | 'idle' | 'error'
  currentTask: string | null
  tasksCompleted: number
  successRate: number
  avgCompletionTime: string
}

interface AgentStatusCardProps {
  agent: Agent
}

const statusConfig = {
  active: {
    icon: PlayIcon,
    label: 'Active',
    color: 'text-success-600',
    bgColor: 'bg-success-100',
    dotColor: 'bg-success-500'
  },
  idle: {
    icon: PauseIcon,
    label: 'Idle',
    color: 'text-secondary-500',
    bgColor: 'bg-secondary-100',
    dotColor: 'bg-secondary-400'
  },
  error: {
    icon: ExclamationTriangleIcon,
    label: 'Error',
    color: 'text-error-600',
    bgColor: 'bg-error-100',
    dotColor: 'bg-error-500'
  }
}

export default function AgentStatusCard({ agent }: AgentStatusCardProps) {
  const config = statusConfig[agent.status]
  const StatusIcon = config.icon

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
          <h3 className="font-semibold text-secondary-900">{agent.name}</h3>
        </div>
        <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
          <StatusIcon className={`h-4 w-4 ${config.color}`} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">Status</span>
          <span className={`font-medium ${config.color}`}>{config.label}</span>
        </div>

        {agent.currentTask && (
          <div className="text-sm">
            <span className="text-secondary-600">Current Task</span>
            <p className="text-secondary-900 truncate mt-1">{agent.currentTask}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-secondary-200">
          <div className="text-center">
            <div className="text-lg font-bold text-secondary-900">{agent.tasksCompleted}</div>
            <div className="text-xs text-secondary-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-secondary-900">{agent.successRate}%</div>
            <div className="text-xs text-secondary-600">Success Rate</div>
          </div>
        </div>

        <div className="text-center pt-2 border-t border-secondary-200">
          <div className="text-sm font-medium text-secondary-900">{agent.avgCompletionTime}</div>
          <div className="text-xs text-secondary-600">Avg. Completion Time</div>
        </div>
      </div>
    </div>
  )
}
