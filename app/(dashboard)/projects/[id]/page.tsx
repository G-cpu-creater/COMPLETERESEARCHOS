'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DataManagementTab,
  VisualizationTab,
  AIInsightsTab,
  ResearchAIChat
} from '@/components/LazyComponents'
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel'
import { LabNotebook } from '@/components/notebook/LabNotebook'
import { LiteratureManager } from '@/components/literature/LiteratureManager'
import { ExportPanel } from '@/components/export/ExportPanel'
import { Users, BookOpen, FileText, Download, ArrowRight, Sparkles, ChevronRight, ChevronLeft, Home, BarChart3, Lightbulb } from 'lucide-react'
import { NotesContainer } from '@/components/Notes/NotesContainer'
import { Button } from '@/components/ui/button'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeView, setActiveView] = useState('overview')

  useEffect(() => {
    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`)
      const data = await res.json()
      setProject(data.project)
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  // Research Tools - defined before early returns
  const researchTools = [
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Work together with your team',
      icon: Users,
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      id: 'export',
      title: 'Export & Publish',
      description: 'Publication-ready exports',
      icon: Download,
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      id: 'notebook',
      title: 'Lab Notebook',
      description: 'Document experiments with timestamps',
      icon: BookOpen,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 'literature',
      title: 'Literature',
      description: 'Manage papers and citations',
      icon: FileText,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ]

  // Navigation items for sidebar
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'visualization', label: 'Visualization', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Project not found</h3>
            <p className="text-gray-600">
              This project may have been deleted or you don't have access to it.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Find Overview Page (first page or specific title)
  const overviewPage = project?.pages?.[0]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar Ribbon */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r shadow-lg transition-all duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'w-64' : 'w-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main Sections
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeView === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}

            <div className="pt-6 mt-6 border-t">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Research Tools
              </div>
              {researchTools.map((tool) => {
                const Icon = tool.icon
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveView(tool.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeView === tool.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{tool.title}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-300 rounded-r-lg rounded-l-none shadow-lg ${
          sidebarOpen ? 'left-64' : 'left-0'
        }`}
        size="sm"
        variant="default"
      >
        {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="p-8">
            {/* Header - Only for Overview */}
            {activeView === 'overview' && (
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                {project.description && (
                  <p className="text-gray-600">{project.description}</p>
                )}
                {project.researchType && (
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                      {project.researchType}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Content Tabs */
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
              {/* Hidden TabsList - navigation is in sidebar */}
              <TabsList className="hidden"></TabsList>

        {/* Overview Tab - Notes Container */}
        <TabsContent value="overview" className="space-y-6">
          {/* Notes Container (Jupyter-style blocks) */}
          {overviewPage ? (
            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">Research Notes</h2>
              </div>
              <div className="h-[800px]">
                <NotesContainer noteId={overviewPage.id} />
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No overview page found for this project.
              </CardContent>
            </Card>
          )}

          {/* Research Tools - Keep only 4 tools */}
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
              <h2 className="text-xl font-bold">Research Tools</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {researchTools.map((tool) => {
                const Icon = tool.icon
                return (
          </div>
        </div>
      </div>
                  <Card
                    key={tool.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-500 group"
                    onClick={() => setActiveView(tool.id)}
                  >
                    <CardContent className="p-6">
                      <div className={`h-12 w-12 rounded-xl ${tool.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${tool.iconColor}`} />
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                      <div className="flex items-center text-sm text-blue-600 font-medium">
                        Open
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* AI Interaction Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                AI Research Assistant
              </CardTitle>
              <CardDescription>
                Powered by Groq Llama 3.1 8B - Get help with your research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResearchAIChat
                context={{
                  projectInfo: `Project: ${project.title}. ${project.description || ''}`,
                  datasetInfo: project.datasets?.length ? `${project.datasets.length} datasets uploaded` : 'No datasets yet'
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visualization Tab - NEW */}
        <TabsContent value="visualization">
          <VisualizationTab />
        </TabsContent>

        {/* Insights Tab - NEW */}
        <TabsContent value="insights">
          <AIInsightsTab />
        </TabsContent>

        {/* Research Tool Tabs (kept from original) */}
        <TabsContent value="collaboration">
          <CollaborationPanel projectId={projectId} />
        </TabsContent>

        <TabsContent value="notebook">
          <LabNotebook projectId={projectId} />
        </TabsContent>

        <TabsContent value="literature">
          <LiteratureManager projectId={projectId} />
        </TabsContent>

        <TabsContent value="export">
          <ExportPanel projectId={projectId} projectTitle={project.title} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

