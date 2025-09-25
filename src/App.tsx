// App.tsx - Main Application Component
import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar, Header } from './components/shared';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips';
import ELDLogs from './pages/ELDLogs';
import RoutePlanner from './pages/RoutePlanner';
import Compliance from './pages/Compliance';
import Settings from './pages/Settings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'trips':
        return <Trips />;
      case 'logs':
        return <ELDLogs />;
      case 'routes':
        return <RoutePlanner />;
      case 'compliance':
        return <Compliance />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex-1 flex flex-col lg:ml-0">
          <Header setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 p-6 overflow-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
