import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import NominationForm from './NominationForm';
import OfficerForm from './OfficerForm';
import OfficerList from './OfficerList';
import ProgrammeForm from './ProgrammeForm';

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex" style={{ minHeight: '100vh' }}>

        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '250px', flexShrink: 0 }}>
          <h5 className="mb-4 text-center">Training System</h5>
          <ul className="nav nav-pills flex-column gap-2">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`} end>
                Nominate Officer
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/add-officer" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`}>
                Add Officer
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/add-programme" className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary' : 'text-white'}`}>
                Add Programme
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 bg-light">
          <Routes>
            <Route path="/" element={<NominationForm programmeId={0} refreshKey={0} onCancelled={function (): void {
              throw new Error('Function not implemented.');
            } } />} />
            <Route path="/add-officer" element={<OfficerPage />} />
            <Route path="/add-programme" element={<ProgrammePage />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

function OfficerPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const handleOfficerAdded = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <OfficerForm onOfficerAdded={handleOfficerAdded} />
          <OfficerList refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}

function ProgrammePage() {
  const handleProgrammeAdded = () => {
    // Optionally add a ProgrammeList here later, same pattern as OfficerList
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ProgrammeForm onProgrammeAdded={handleProgrammeAdded} />
        </div>
      </div>
    </div>
  );
}

export default App;