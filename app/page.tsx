import Link from 'next/link'
import { ArrowRightIcon, CodeBracketIcon, BugAntIcon, CogIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/24/solid'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const features = [
  {
    name: 'Automated Code Review',
    description: 'AI agents analyze your code for bugs, security vulnerabilities, and best practices.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Intelligent Bug Fixes',
    description: 'Automatically detect and fix common bugs with context-aware solutions.',
    icon: BugAntIcon,
  },
  {
    name: 'Feature Development',
    description: 'Generate boilerplate code, implement features, and write comprehensive tests.',
    icon: CogIcon,
  },
  {
    name: 'Quality Assurance',
    description: 'Automated testing, performance optimization, and security scanning.',
    icon: ShieldCheckIcon,
  },
]

const benefits = [
  'Reduce code review time by 70%',
  'Fix bugs 5x faster with AI assistance',
  'Maintain consistent code quality',
  'Integrate seamlessly with Jira & Bitbucket',
  'Support for 20+ programming languages',
  'Real-time collaboration and monitoring',
]

const stats = [
  { name: 'Lines of Code Reviewed', value: '10M+' },
  { name: 'Bugs Fixed', value: '50K+' },
  { name: 'Development Teams', value: '500+' },
  { name: 'Time Saved', value: '70%' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-secondary-900 mb-6">
              Supercharge Your Development Team with{' '}
              <span className="text-gradient">AI Coding Agents</span>
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-10">
              Leverage intelligent AI agents for automated code review, bug fixes, feature development, 
              and testing. Integrate seamlessly with your existing workflow and boost productivity by 70%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3 flex items-center justify-center whitespace-nowrap">
                Start Free Trial
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#features" className="btn-secondary text-lg px-8 py-3">
                Learn More
              </Link>
            </div>
            <p className="text-sm text-secondary-500 mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-sm text-secondary-600 mt-1">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
              Everything Your Development Team Needs
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Our AI agents handle the repetitive tasks so your team can focus on innovation and creativity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="card-hover text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-6">
                Why Development Teams Choose Our AI Agents
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-secondary-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/auth/signup" className="btn-primary text-xl px-10 py-4">
                  Get Started Today
                </Link>
              </div>
            </div>
            <div className="bg-secondary-900 rounded-2xl p-8 text-white">
              <div className="font-mono text-sm">
                <div className="text-success-400"># AI Agent automatically fixes bug</div>
                <div className="mt-2 text-secondary-300">
                  <span className="text-error-400">- if (user.age &gt; 18)</span><br />
                  <span className="text-success-400">+ if (user.age &gt;= 18)</span><br />
                  <span className="text-secondary-300">    return true;</span>
                </div>
                <div className="mt-4 text-primary-400">
                  ✓ Bug fixed in 2.3 seconds<br />
                  ✓ Test cases updated<br />
                  ✓ Pull request created
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
            Seamless Integration with Your Workflow
          </h2>
          <p className="text-xl text-secondary-600 mb-12 max-w-2xl mx-auto">
            Connect with the tools you already use and love. Our AI agents work where you work.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">J</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Jira Integration</h3>
              <p className="text-secondary-600">
                Trigger AI agents directly from Jira issues and track progress in real-time.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">B</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Bitbucket Integration</h3>
              <p className="text-secondary-600">
                Monitor commits, branches, and pull requests with intelligent insights.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">+</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">More Integrations</h3>
              <p className="text-secondary-600">
                GitHub, GitLab, Slack, and more integrations coming soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Development Process?
          </h2>
          <p className="text-xl text-secondary-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of development teams who have already supercharged their productivity with AI agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Start Your Free Trial
            </Link>
            <Link href="/contact" className="bg-transparent hover:bg-white/10 text-white font-medium py-3 px-8 rounded-lg border border-white/20 transition-colors duration-200">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
