'use client'

import { useState } from 'react'
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  PencilIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'

interface Agent {
  id: string
  name: string
  status: 'active' | 'idle' | 'error'
  currentTask: string | null
  currentBranch?: string
  repository?: string
  tasksCompleted: number
  successRate: number
  avgCompletionTime: string
}

interface EnhancedAgentCardProps {
  agent: Agent
  onStartAgent?: (agentId: string, task: string) => void
  onStopAgent?: (agentId: string) => void
  onAssignTask?: (agentId: string, task: string) => void
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

export default function EnhancedAgentCard({ 
  agent, 
  onStartAgent, 
  onStopAgent, 
  onAssignTask 
}: EnhancedAgentCardProps) {
  const [showTaskInput, setShowTaskInput] = useState(false)
  const [taskInput, setTaskInput] = useState('')
  const config = statusConfig[agent.status]
  const StatusIcon = config.icon

  const handleStartAgent = () => {
    if (taskInput.trim() && onStartAgent) {
      onStartAgent(agent.id, taskInput.trim())
      setTaskInput('')
      setShowTaskInput(false)
    }
  }

  const handleStopAgent = () => {
    if (onStopAgent) {
      onStopAgent(agent.id)
    }
  }

  const handleAssignTask = () => {
    if (taskInput.trim() && onAssignTask) {
      onAssignTask(agent.id, taskInput.trim())
      setTaskInput('')
      setShowTaskInput(false)
    }
  }

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

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-600">Status</span>
          <span className={`font-medium ${config.color}`}>{config.label}</span>
        </div>

        {/* Current Task and Branch Info */}
        {agent.currentTask && (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-secondary-600">Current Task</span>
              <p className="text-secondary-900 text-xs mt-1 bg-secondary-50 p-2 rounded">{agent.currentTask}</p>
            </div>
            
            {agent.currentBranch && agent.repository && (
              <div className="flex items-center space-x-2 text-xs">
                <CodeBracketIcon className="h-4 w-4 text-secondary-400" />
                <span className="text-secondary-600">{agent.repository}</span>
                <span className="text-secondary-400">/</span>
                <span className="font-mono text-secondary-900 bg-secondary-100 px-2 py-1 rounded">
                  {agent.currentBranch}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Agent Controls */}
        <div className="flex space-x-2">
          {agent.status === 'idle' || agent.status === 'error' ? (
            <button
              onClick={() => setShowTaskInput(true)}
              className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100"
            >
              <PlayIcon className="h-4 w-4 mr-1" />
              Start
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowTaskInput(true)}
                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-secondary-700 bg-secondary-50 border border-secondary-200 rounded-md hover:bg-secondary-100"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Assign
              </button>
              <button
                onClick={handleStopAgent}
                className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-error-700 bg-error-50 border border-error-200 rounded-md hover:bg-error-100"
              >
                <StopIcon className="h-4 w-4 mr-1" />
                Stop
              </button>
            </>
          )}
        </div>

        {/* Task Input Modal */}
        {showTaskInput && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-secondary-900/80" onClick={() => setShowTaskInput(false)} />
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  {agent.status === 'active' ? 'Assign New Task' : 'Start Agent'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Task Description
                    </label>
                    <textarea
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Describe the task you want the agent to work on..."
                      className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowTaskInput(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={agent.status === 'active' ? handleAssignTask : handleStartAgent}
                    disabled={!taskInput.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {agent.status === 'active' ? 'Assign Task' : 'Start Agent'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-secondary-200">
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
