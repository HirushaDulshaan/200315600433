import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import NominationsList from './NominationsList';

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
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow mb-4">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Nominate Officer for Training</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Training Programme</label>
                  <select
                    className="form-select"
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

                <div className="mb-3">
                  <label className="form-label">Officer</label>
                  <select
                    className="form-select"
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

                <div className="mb-3">
                  <label className="form-label">Nominating Department</label>
                  <select
                    className="form-select"
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

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Nomination'
                  )}
                </button>
              </form>

              {message && (
                <div className={`alert mt-3 ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
                  {status && (
                    <span className={`badge me-2 ${status === 'CONFIRMED' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {status}
                    </span>
                  )}
                  {message}
                </div>
              )}
            </div>
          </div>

          {selectedProgrammeId && (
            <NominationsList
              programmeId={Number(selectedProgrammeId)}
              programmeTitle={selectedProgramme?.title ?? ''}
              refreshKey={refreshKey}
              onCancelled={() => setRefreshKey(prev => prev + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default NominationForm;