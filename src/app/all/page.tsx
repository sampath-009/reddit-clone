import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import PostFeed from '@/components/PostFeed'
import CreatePost from '@/components/CreatePost'
import AppShell from '@/components/layout/AppShell'

export default function AllPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AppShell right={<Sidebar />}>
        <div className="space-y-6">
          {/* All Header */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌐</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">All</h1>
                <p className="text-muted-foreground">Posts from all communities across Reddit Clone</p>
              </div>
            </div>
          </div>
          
          <CreatePost />
          <PostFeed sortBy="all" />
        </div>
      </AppShell>
    </div>
  )
}
