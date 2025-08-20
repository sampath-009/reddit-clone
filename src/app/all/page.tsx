import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import PostFeed from '@/components/PostFeed'
import CreatePost from '@/components/CreatePost'

export default function AllPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* All Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🌐</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">All</h1>
                  <p className="text-gray-600">Posts from all communities across Reddit Clone</p>
                </div>
              </div>
            </div>
            
            <CreatePost />
            <PostFeed sortBy="all" />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
