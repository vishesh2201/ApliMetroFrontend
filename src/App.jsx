import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FleetTable from './components/FleetTable';
import InductionList from './components/InductionList';
import InductionListDetailed from './components/InductionListDetailed';
import { InductionListProvider } from './context/InductionListContext';
import { TrainListProvider } from './context/TrainListContext';
import LoadingScreen from './components/LoadingScreen'; // Import the LoadingScreen component

function App() {
  const [activeTab, setActiveTab] = useState('fleet');
  const [isInductionListCollapsed, setIsInductionListCollapsed] = useState(false); // New state for InductionList collapse
  const [showInductionList, setShowInductionList] = useState(true); // New state to control visibility of InductionList
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
              <div className="flex flex-col lg:flex-row lg:space-x-2 h-full w-full p-6">
                <div className={`h-full w-full ${showInductionList ? (isInductionListCollapsed ? 'flex-1' : 'lg:w-2/3') : 'flex-1'}`}> {/* Conditional width for FleetTable */}
                  <div className="h-full max-h-full overflow-auto">
                    <FleetTable showInductionList={showInductionList} setShowInductionList={setShowInductionList} />
                  </div>
                </div>
                {showInductionList && ( // Conditionally render InductionList container
                  <div className={`w-full ${isInductionListCollapsed ? 'lg:w-20' : 'lg:w-1/3'} h-full`}> {/* Conditional width for InductionList */}
                    <div className="h-full max-h-full overflow-auto">
                      <InductionList
                        isCollapsed={isInductionListCollapsed}
                        setIsCollapsed={setIsInductionListCollapsed}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'induction' && (
              <div className="w-full h-full max-h-full overflow-auto p-6">
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
            {activeTab === 'settings' && (
              <div className="h-full max-h-full overflow-auto flex items-center justify-center text-xl text-gray-500 w-full p-6">
                Settings coming soon...
              </div>
            )}
          </main>
        </div>
        {isLoading && <LoadingScreen />} { /* Conditionally render LoadingScreen as an overlay */}
      </InductionListProvider>
    </TrainListProvider>
  );
}

export default App;