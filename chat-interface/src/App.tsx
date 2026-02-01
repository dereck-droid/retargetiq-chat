import { ChatWidget } from './components/ChatWidget'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Preview container - remove wrapper for production embed */}
      <div className="w-[400px] h-[650px] shadow-2xl rounded-xl overflow-hidden">
        <ChatWidget />
      </div>
    </div>
  )
}

export default App
