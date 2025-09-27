import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FleetTable from './components/FleetTable';
import InductionList from './components/InductionList';
import InductionGrid from './components/InductionGrid';
import InductionListDetailed from './components/InductionListDetailed';
import { InductionListProvider } from './context/InductionListContext';
import { TrainListProvider } from './context/TrainListContext';
import LoadingScreen from './components/LoadingScreen'; // Import the LoadingScreen component
import Statistics from './components/Statistics';
import { StatisticsProvider } from './context/StatisticsContext';
import { Menu } from 'lucide-react'; // Import the Menu icon

function App() {
  const [activeTab, setActiveTab] = useState('fleet');
  const [fleetView, setFleetView] = useState('fleet-table'); // 'fleet-table' or 'induction-list'
  const [isLoading, setIsLoading] = useState(true); // New state for loading screen

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    alert('Logged out');
  };

  return (
    <TrainListProvider>
      <InductionListProvider>
        <StatisticsProvider>
          <div className="flex h-screen">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

            <main className={`flex-1 bg-gray-50 w-full lg:ml-64`}>
              {/* Removed: <div className="p-6">
                <button
                    onClick={handleGenerateOptimization}
                    className="mb-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Generate Optimization
                </button>
            </div> */}

              {activeTab === 'fleet' && (
                <div className="flex flex-col h-full">
                  <div className="flex space-x-4 p-6 pb-0">
                    <span className="flex items-center space-x-1">
                      <Menu size={20} className={`self-center ${fleetView === 'fleet-table' ? 'text-[#4285F4]' : 'text-gray-600'}`} />
                      <button
                        onClick={() => setFleetView('fleet-table')}
                        className={`pb-2 px-3 text-base font-semibold bg-transparent ${fleetView === 'fleet-table' ? 'text-[#4285F4] border-b-2 border-[#4285F4]' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'}`}
                      >
                        Fleet Table
                      </button>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Menu size={20} className={`self-center ${fleetView === 'induction-list' ? 'text-[#4285F4]' : 'text-gray-600'}`} />
                      <button
                        onClick={() => setFleetView('induction-list')}
                        className={`pb-2 px-3 text-base font-semibold bg-transparent ${fleetView === 'induction-list' ? 'text-[#4285F4] border-b-2 border-[#4285F4]' : 'text-gray-500 border-b-2 border-transparent hover:text-gray-700'}`}
                      >
                        Tracks and Positions
                      </button>
                    </span>

                  </div>
                  <div className="flex-1 p-6 overflow-auto">
                    {isLoading ? (
                      <LoadingScreen />
                    ) : (
                      <>
                        {fleetView === 'fleet-table' && (
                          <>

                            <FleetTable
                              onTrainSelect={(trainId) => {
                                console.log('Train selected:', trainId);
                              }}


                            />
                          </>
                        )}
                        {fleetView === 'induction-list' && (
                          <InductionGrid />
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'induction-detailed' && (
                <div className="flex-1 p-6 overflow-auto">
                  <InductionListDetailed />
                </div>
              )}
              {activeTab === 'simulation' && (
                <div className="h-full max-h-full overflow-auto flex items-center justify-center text-xl text-gray-500 w-full p-6">
                  What-If Simulation coming soon...
                </div>
              )}
              {activeTab === 'reports' && (
                <div className="h-full max-h-full overflow-auto flex items-center justify-center text-xl text-gray-500 w-full p-6">
                  Reports coming soon...
                </div>
              )}
              {activeTab === 'statistics' && (
                <div className="w-full h-full max-h-full overflow-auto p-6">
                  <Statistics />
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="h-full max-h-full overflow-auto flex items-center justify-center text-xl text-gray-500 w-full p-6">
                  Settings coming soon...
                </div>
              )}
            </main>
          </div>
          {isLoading && <LoadingScreen />} { /* Conditionally render LoadingScreen as an overlay */}
        </StatisticsProvider>
      </InductionListProvider>
    </TrainListProvider>
  );
}

export default App;