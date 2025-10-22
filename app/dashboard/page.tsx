'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  PlusIcon, 
  PlayIcon, 
  PauseIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  CodeBracketIcon,
  BugAntIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { useSocket } from '@/app/providers'
import DashboardLayout from '@/components/DashboardLayout'
import TaskCard from '@/components/TaskCard'
import EnhancedAgentCard from '@/components/EnhancedAgentCard'
import ActivityFeed from '@/components/ActivityFeed'

// Mock data - replace with real API calls
const mockTasks = [
  {
    id: '1',
    title: 'Code Review: User Authentication Module',
    type: 'code_review',
    status: 'in_progress',
    progress: 65,
    agent: 'CodeReview Agent',
    repository: 'frontend-app',
    branch: 'feature/auth-system',
    createdAt: '2024-01-15T10:30:00Z',
    estimatedCompletion: '2024-01-15T11:15:00Z',
    language: 'TypeScript',
    framework: 'Next.js'
  },
  {
    id: '2',
    title: 'Bug Fix: Memory Leak in Data Processing',
    type: 'bug_fix',
    status: 'completed',
    progress: 100,
    agent: 'BugFix Agent',
    repository: 'backend-api',
    branch: 'hotfix/memory-leak',
    createdAt: '2024-01-15T09:00:00Z',
    completedAt: '2024-01-15T09:45:00Z',
    language: 'Python',
    framework: 'FastAPI'
  },
  {
    id: '3',
    title: 'Feature: Implement OAuth Integration',
    type: 'feature_development',
    status: 'pending',
    progress: 0,
    agent: 'Feature Agent',
    repository: 'auth-service',
    branch: 'feature/oauth-providers',
    createdAt: '2024-01-15T11:00:00Z',
    language: 'JavaScript',
    framework: 'Express.js'
  },
  {
    id: '4',
    title: 'Testing: API Endpoint Coverage',
    type: 'testing',
    status: 'error',
    progress: 30,
    agent: 'Testing Agent',
    repository: 'backend-api',
    branch: 'test/api-coverage',
    createdAt: '2024-01-15T08:30:00Z',
    error: 'Test environment connection failed',
    language: 'Python',
    framework: 'pytest'
  }
]

const mockAgents = [
  {
    id: '1',
    name: 'CodeReview Agent',
    status: 'active',
    currentTask: 'Reviewing authentication module',
    currentBranch: 'feature/auth-system',
    repository: 'frontend-app',
    tasksCompleted: 23,
    successRate: 94,
    avgCompletionTime: '12 min'
  },
  {
    id: '2',
    name: 'BugFix Agent',
    status: 'active',
    currentTask: 'Analyzing performance issues',
    currentBranch: 'hotfix/memory-leak',
    repository: 'backend-api',
    tasksCompleted: 18,
    successRate: 89,
    avgCompletionTime: '8 min'
  },
  {
    id: '3',
    name: 'Feature Agent',
    status: 'idle',
    currentTask: null,
    tasksCompleted: 15,
    successRate: 92,
    avgCompletionTime: '25 min'
  },
  {
    id: '4',
    name: 'Testing Agent',
    status: 'error',
    currentTask: 'Connection timeout',
    tasksCompleted: 31,
    successRate: 96,
    avgCompletionTime: '6 min'
  }
]

const mockActivity = [
  {
    id: '1',
    type: 'task_completed',
    message: 'Bug fix completed for memory leak issue',
    agent: 'BugFix Agent',
    timestamp: '2024-01-15T09:45:00Z',
    details: {
      repository: 'backend-api',
      branch: 'hotfix/memory-leak',
      linesChanged: 23
    }
  },
  {
    id: '2',
    type: 'task_started',
    message: 'Started code review for authentication module',
    agent: 'CodeReview Agent',
    timestamp: '2024-01-15T10:30:00Z',
    details: {
      repository: 'frontend-app',
      branch: 'feature/auth-system'
    }
  },
  {
    id: '3',
    type: 'error',
    message: 'Test environment connection failed',
    agent: 'Testing Agent',
    timestamp: '2024-01-15T10:15:00Z',
    details: {
      error: 'Connection timeout after 30 seconds'
    }
  },
  {
    id: '4',
    type: 'integration_sync',
    message: 'Synced 5 new issues from Jira',
    agent: 'System',
    timestamp: '2024-01-15T10:00:00Z',
    details: {
      source: 'Jira',
      items: 5
    }
  }
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  
  // Show mock data only for demo@example.com, otherwise start with empty state
  const isDemoUser = session?.user?.email === 'demo@example.com'
  const [tasks, setTasks] = useState(isDemoUser ? mockTasks : [])
  const [agents, setAgents] = useState(isDemoUser ? mockAgents : [])
  const [activity, setActivity] = useState(isDemoUser ? mockActivity : [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (socket) {
      socket.on('task_update', (updatedTask) => {
        setTasks(prev => prev.map(task => 
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        ))
      })

      socket.on('agent_status', (agentUpdate) => {
        setAgents(prev => prev.map(agent => 
          agent.id === agentUpdate.id ? { ...agent, ...agentUpdate } : agent
        ))
      })

      socket.on('new_activity', (newActivity) => {
        setActivity(prev => [newActivity, ...prev.slice(0, 9)])
      })

      return () => {
        socket.off('task_update')
        socket.off('agent_status')
        socket.off('new_activity')
      }
    }
  }, [socket])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    )
  }

  const handleStartAgent = (agentId: string, task: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'active', currentTask: task }
        : agent
    ))
  }
  
  const handleStopAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'idle', currentTask: null, currentBranch: undefined, repository: undefined }
        : agent
    ))
  }
  
  const handleAssignTask = (agentId: string, task: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, currentTask: task }
        : agent
    ))
  }

  const stats = {
    totalTasks: tasks.length,
    activeTasks: tasks.filter(t => t.status === 'in_progress').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    errorTasks: tasks.filter(t => t.status === 'error').length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    idleAgents: agents.filter(a => a.status === 'idle').length,
    errorAgents: agents.filter(a => a.status === 'error').length
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Welcome back, {session?.user?.name || 'Developer'}!
            </h1>
            <p className="text-secondary-600 mt-1">
              Monitor your AI agents and track coding tasks in real-time
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success-500' : 'bg-error-500'}`}></div>
              <span className="text-secondary-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Link href="/dashboard/tasks/new" className="btn-primary flex items-center justify-center whitespace-nowrap">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Task
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Active Tasks</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.activeTasks}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Completed</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.completedTasks}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <PlayIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Active Agents</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.activeAgents}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-error-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Errors</p>
                <p className="text-2xl font-bold text-secondary-900">{stats.errorTasks + stats.errorAgents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Column */}
<div className="lg:col-span-2 space-y-6">
  {agents.length === 0 ? (
    // First-time user onboarding: No agents exist
    <div className="card text-center py-16">
      <div className="mx-auto w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
        <CodeBracketIcon className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="text-2xl font-bold text-secondary-900 mb-2">Welcome to MantaFlow!</h3>
      <p className="text-secondary-600 mb-8 max-w-md mx-auto">
        Let's get you started. Create your first AI agent to automate your development workflow.
      </p>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button className="btn-primary flex items-center justify-center whitespace-nowrap">
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Your First Agent
          </button>
          <Link href="/dashboard/settings" className="btn-secondary flex items-center justify-center whitespace-nowrap">
            <CogIcon className="h-5 w-5 mr-2" />
            Connect Integrations
          </Link>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                <CodeBracketIcon className="h-5 w-5 text-primary-600" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-1 text-sm">Create Agents</h4>
              <p className="text-xs text-secondary-600">Set up AI agents to handle code reviews, bug fixes, and more</p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                <CogIcon className="h-5 w-5 text-primary-600" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-1 text-sm">Connect Tools</h4>
              <p className="text-xs text-secondary-600">Integrate with Jira and GitHub for seamless workflow</p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                <BugAntIcon className="h-5 w-5 text-primary-600" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-1 text-sm">Automate Tasks</h4>
              <p className="text-xs text-secondary-600">Let AI agents handle repetitive development tasks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : tasks.length === 0 ? (
    // User has agents but no tasks
    <div className="card text-center py-12">
      <div className="mx-auto w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
        <PlusIcon className="h-6 w-6 text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Tasks Yet</h3>
      <p className="text-secondary-600 mb-6">
        You have agents ready to work. Create your first task or connect to Jira/GitHub to sync tasks automatically.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard/tasks/new" className="btn-primary flex items-center justify-center whitespace-nowrap">
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Task
        </Link>
        <Link href="/dashboard/settings" className="btn-secondary flex items-center justify-center whitespace-nowrap">
          <CogIcon className="h-5 w-5 mr-2" />
          Connect Jira & GitHub
        </Link>
      </div>
    </div>
  ) : (
    // User has tasks - show them
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-secondary-900">Recent Tasks</h2>
        <Link href="/dashboard/tasks" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all tasks →
        </Link>
      </div>
      
      <div className="space-y-4">
        {tasks.slice(0, 4).map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </>
  )}
</div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Status */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-secondary-900">AI Agents</h2>
                {agents.length > 0 && (
                  <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    <PlusIcon className="h-4 w-4 inline mr-1" />
                    Add Agent
                  </button>
                )}
              </div>
              {agents.length === 0 ? (
                <div className="card text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-3">
                    <ShieldCheckIcon className="h-6 w-6 text-secondary-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-secondary-900 mb-2">No Agents Yet</h3>
                  <p className="text-xs text-secondary-600 mb-4 px-4">
                    Create your first AI agent to start automating tasks
                  </p>
                  <button className="btn-primary btn-sm flex items-center justify-center whitespace-nowrap">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Create Agent
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <EnhancedAgentCard 
                      key={agent.id} 
                      agent={agent}
                      onStartAgent={handleStartAgent}
                      onStopAgent={handleStopAgent}
                      onAssignTask={handleAssignTask}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            {agents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-4">Recent Activity</h2>
                {activity.length === 0 ? (
                  <div className="card text-center py-8">
                    <ClockIcon className="h-8 w-8 text-secondary-400 mx-auto mb-2" />
                    <p className="text-sm text-secondary-600">No activity yet</p>
                    <p className="text-xs text-secondary-500 mt-1">Start an agent to see activity</p>
                  </div>
                ) : (
                  <ActivityFeed activities={activity.slice(0, 5)} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
