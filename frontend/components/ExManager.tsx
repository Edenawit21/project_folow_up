import NavBar from "@/components/NavBar";

export default function ExecutiveDashboard() {
    return (
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-300 text-white p-4">
          <h2 className="text-xl font-bold text-black mb-6">Dashboard</h2>
          <nav className="space-y-4">
             <a href="#projects" className="block text-black hover:text-blue-500 font-bold transition-colors duration-200">
                Projects </a>
             <a href="#chatbox" className="block text-black hover:text-blue-500 font-bold transition-colors duration-200">
                Chatbox </a>
        </nav>
        </aside>
  
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Executive Manager Dashboard</h1>
          </header>
  
          <main className="p-6 bg-gray-100 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold text-yellow-400">Total Projects</h2>
                <p className="text-3xl font-bold">32</p>
              </div>
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold text-blue-500">Active Projects</h2>
                <p className="text-3xl font-bold">18</p>
              </div>
              <div className="bg-white shadow rounded-xl p-6">
                <h2 className="text-xl font-semibold text-green-500">Completed Projects</h2>
                <p className="text-3xl font-bold">10</p>
              </div>
            </div>
  
            
          </main>
        </div>
      </div>
    );
  }
  
