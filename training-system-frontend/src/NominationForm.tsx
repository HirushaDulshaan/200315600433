import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import NominationsList from './NominationsList';
import './NominationForm.css';

const departments = [
  'Finance', 'Administration', 'Human Resources', 'IT', 'Procurement',
  'Legal', 'Planning', 'Audit', 'Engineering', 'Health Services'
];

interface Officer {
  officerId: number;
  name: string;
  nic: string;
  department: string;
}

interface TrainingProgramme {
  programmeId: number;
  title: string;
  trainingDate: string;
  venue: string;
  maxParticipants: number;
}

function NominationForm() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [programmes, setProgrammes] = useState<TrainingProgramme[]>([]);

  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('');
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>('');
  const [nominatingDepartment, setNominatingDepartment] = useState<string>('');

  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/officers')
      .then(res => setOfficers(res.data))
      .catch(err => console.error('Failed to load officers', err));

    axios.get('http://localhost:5000/api/programmes')
      .then(res => setProgrammes(res.data))
      .catch(err => console.error('Failed to load programmes', err));
  }, []);

  // Find the full programme object for the currently selected programme
  const selectedProgramme = programmes.find(p => p.programmeId === Number(selectedProgrammeId));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setStatus('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/nominations', {
        programmeId: selectedProgrammeId,
        officerId: selectedOfficerId,
        nominatingDepartment
      });
      setIsError(false);
      setMessage(res.data.message);
      setStatus(res.data.status);
      setSelectedOfficerId('');
      setNominatingDepartment('');
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      setIsError(true);
      setStatus('');
      setMessage(err.response ? err.response.data.message : 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-xl-5 bg-light min-vh-100">
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Training Nominations</h3>
          <p className="text-muted small mb-0">Assign departmental officers to available training programmes</p>
        </div>
      </div>

      {/* Grid: Left (Form) | Right (List) */}
      <div className="row g-4">
        {/* Left Side: Form */}
        <div className="col-12 col-lg-5 col-xl-4">
          <div className="position-sticky" style={{ top: '1.5rem' }}>
            <div className="card custom-nomination-card border-0">
              <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="header-icon-badge">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      <path d="m9 14 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="card-title fw-bold mb-1 text-dark">Nominate Officer</h5>
                    <p className="text-muted small mb-0">Select programme and candidate</p>
                  </div>
                </div>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label-custom">Training Programme</label>
                    <select
                      className="form-select custom-input"
                      value={selectedProgrammeId}
                      onChange={(e) => setSelectedProgrammeId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Programme --</option>
                      {programmes.map(p => (
                        <option key={p.programmeId} value={p.programmeId}>
                          {p.title} ({p.trainingDate}) — Max {p.maxParticipants}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-custom">Officer</label>
                    <select
                      className="form-select custom-input"
                      value={selectedOfficerId}
                      onChange={(e) => setSelectedOfficerId(e.target.value)}
                      required
                    >
                      <option value="">-- Select Officer --</option>
                      {officers.map(o => (
                        <option key={o.officerId} value={o.officerId}>
                          {o.name} — {o.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label-custom">Nominating Department</label>
                    <select
                      className="form-select custom-input"
                      value={nominatingDepartment}
                      onChange={(e) => setNominatingDepartment(e.target.value)}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2">
                    <button type="submit" className="btn custom-submit-btn w-100 py-2.5" disabled={loading}>
                      {loading ? (
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        'Submit Nomination'
                      )}
                    </button>
                  </div>
                </form>

                {message && (
                  <div className={`alert custom-alert mt-4 mb-0 ${isError ? 'alert-danger border-0' : 'alert-success border-0'}`} role="alert">
                    <div className="d-flex align-items-center">
                      <span className="me-2">{isError ? '⚠️' : '✅'}</span>
                      {status && (
                        <span className={`badge me-2 ${status === 'CONFIRMED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {status}
                        </span>
                      )}
                      <div>{message}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Nominations List */}
        <div className="col-12 col-lg-7 col-xl-8">
          {selectedProgrammeId ? (
            <NominationsList
              programmeId={Number(selectedProgrammeId)}
              programmeTitle={selectedProgramme?.title ?? ''}
              refreshKey={refreshKey}
              onCancelled={() => setRefreshKey(prev => prev + 1)}
            />
          ) : (
            <div className="card custom-empty-state border-0 p-5 text-center">
              <div className="empty-icon mb-3">📋</div>
              <h5 className="fw-bold text-dark">No Programme Selected</h5>
              <p className="text-muted small mx-auto" style={{ maxWidth: '360px' }}>
                Please choose a training programme from the left menu to view enrolled officers and manage nominations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NominationForm;