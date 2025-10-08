'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { 
  CodeBracketIcon, 
  BugAntIcon, 
  CogIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

const taskSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['code_review', 'bug_fix', 'feature_development', 'testing']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  repository: z.string().min(1, 'Repository is required'),
  branch: z.string().min(1, 'Branch is required'),
  language: z.string().min(1, 'Programming language is required'),
  framework: z.string().optional(),
  agent: z.string().min(1, 'Agent selection is required'),
  jiraIssue: z.string().optional(),
  estimatedHours: z.number().min(0.5).max(40).optional(),
  tags: z.string().optional(),
})

type TaskForm = z.infer<typeof taskSchema>

const taskTypes = [
  {
    value: 'code_review',
    label: 'Code Review',
    description: 'Analyze code for bugs, security issues, and best practices',
    icon: CodeBracketIcon,
    color: 'border-blue-200 bg-blue-50'
  },
  {
    value: 'bug_fix',
    label: 'Bug Fix',
    description: 'Identify and fix bugs in existing code',
    icon: BugAntIcon,
    color: 'border-red-200 bg-red-50'
  },
  {
    value: 'feature_development',
    label: 'Feature Development',
    description: 'Build new features and functionality',
    icon: CogIcon,
    color: 'border-green-200 bg-green-50'
  },
  {
    value: 'testing',
    label: 'Testing',
    description: 'Create and run automated tests',
    icon: ShieldCheckIcon,
    color: 'border-purple-200 bg-purple-50'
  }
]

const availableAgents = [
  { id: 'code-review-agent', name: 'CodeReview Agent', speciality: 'Code analysis and review' },
  { id: 'bugfix-agent', name: 'BugFix Agent', speciality: 'Bug detection and fixing' },
  { id: 'feature-agent', name: 'Feature Agent', speciality: 'Feature development' },
  { id: 'testing-agent', name: 'Testing Agent', speciality: 'Test automation' }
]

const languages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'C++', 'C'
]

const frameworks = {
  JavaScript: ['React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Next.js'],
  TypeScript: ['React', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Next.js', 'NestJS'],
  Python: ['Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'TensorFlow'],
  Java: ['Spring Boot', 'Spring MVC', 'Hibernate', 'Maven', 'Gradle'],
  'C#': ['.NET Core', '.NET Framework', 'ASP.NET', 'Entity Framework'],
  Go: ['Gin', 'Echo', 'Fiber', 'Gorilla Mux'],
  Rust: ['Actix', 'Rocket', 'Warp', 'Tokio'],
  PHP: ['Laravel', 'Symfony', 'CodeIgniter', 'Zend'],
  Ruby: ['Ruby on Rails', 'Sinatra', 'Hanami'],
  Swift: ['SwiftUI', 'UIKit', 'Vapor'],
  Kotlin: ['Spring Boot', 'Ktor', 'Android']
}

export default function NewTaskPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
  })

  const watchedType = watch('type')
  const watchedLanguage = watch('language')

  const onSubmit = async (data: TaskForm) => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      toast.success('Task created successfully!')
      router.push('/dashboard/tasks')
    } catch (error) {
      toast.error('Failed to create task. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard/tasks" className="btn-ghost p-2">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">Create New Task</h1>
              <p className="text-secondary-600 mt-1">Configure an AI agent to help with your coding task</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Task Type Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Task Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taskTypes.map((type) => {
                const TypeIcon = type.icon
                return (
                  <label key={type.value} className="cursor-pointer">
                    <input
                      {...register('type')}
                      type="radio"
                      value={type.value}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg transition-all ${
                      watchedType === type.value 
                        ? `${type.color} border-primary-300` 
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <TypeIcon className="h-6 w-6 text-secondary-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-secondary-900">{type.label}</h3>
                          <p className="text-sm text-secondary-600 mt-1">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-error-600">{errors.type.message}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Task Title
                </label>
                <input
                  {...register('title')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., Review authentication module for security issues"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error-600">{errors.title.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="input-field"
                  placeholder="Provide detailed information about what the AI agent should focus on..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-error-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Priority
                </label>
                <select {...register('priority')} className="input-field">
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-error-600">{errors.priority.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Estimated Hours (optional)
                </label>
                <input
                  {...register('estimatedHours', { valueAsNumber: true })}
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="40"
                  className="input-field"
                  placeholder="2.5"
                />
                {errors.estimatedHours && (
                  <p className="mt-1 text-sm text-error-600">{errors.estimatedHours.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Repository & Code Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">Repository & Code</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Repository
                </label>
                <input
                  {...register('repository')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., my-app-frontend"
                />
                {errors.repository && (
                  <p className="mt-1 text-sm text-error-600">{errors.repository.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Branch
                </label>
                <input
                  {...register('branch')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., feature/user-auth"
                />
                {errors.branch && (
                  <p className="mt-1 text-sm text-error-600">{errors.branch.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Programming Language
                </label>
                <select 
                  {...register('language')} 
                  className="input-field"
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value)
                    setValue('framework', '')
                  }}
                >
                  <option value="">Select language</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                {errors.language && (
                  <p className="mt-1 text-sm text-error-600">{errors.language.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Framework (optional)
                </label>
                <select {...register('framework')} className="input-field">
                  <option value="">Select framework</option>
                  {watchedLanguage && frameworks[watchedLanguage as keyof typeof frameworks]?.map((fw) => (
                    <option key={fw} value={fw}>{fw}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Jira Issue (optional)
                </label>
                <input
                  {...register('jiraIssue')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., PROJ-123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tags (optional)
                </label>
                <input
                  {...register('tags')}
                  type="text"
                  className="input-field"
                  placeholder="e.g., security, authentication, urgent"
                />
              </div>
            </div>
          </div>

          {/* Agent Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">AI Agent Selection</h2>
            <div className="space-y-3">
              {availableAgents.map((agent) => (
                <label key={agent.id} className="cursor-pointer">
                  <input
                    {...register('agent')}
                    type="radio"
                    value={agent.name}
                    className="sr-only"
                  />
                  <div className={`p-4 border-2 rounded-lg transition-all ${
                    watch('agent') === agent.name
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{agent.name}</h3>
                        <p className="text-sm text-secondary-600">{agent.speciality}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                        <span className="text-sm text-success-600">Available</span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.agent && (
              <p className="mt-2 text-sm text-error-600">{errors.agent.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <Link href="/dashboard/tasks" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center"
            >
              {isLoading ? (
                <div className="loading-dots mr-2">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <PlusIcon className="h-5 w-5 mr-2" />
              )}
              Create Task
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
