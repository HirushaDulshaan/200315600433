import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';

const departments = [
  'Finance',
  'Administration',
  'Human Resources',
  'IT',
  'Procurement',
  'Legal',
  'Planning',
  'Audit',
  'Engineering',
  'Health Services'
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
}

function NominationForm() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [programmes, setProgrammes] = useState<TrainingProgramme[]>([]);

  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('');
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string>('');
  const [nominatingDepartment, setNominatingDepartment] = useState<string>('');

  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/officers')
      .then(res => setOfficers(res.data))
      .catch(err => console.error('Failed to load officers', err));

    axios.get('http://localhost:5000/api/programmes')
      .then(res => setProgrammes(res.data))
      .catch(err => console.error('Failed to load programmes', err));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/nominations', {
        programmeId: selectedProgrammeId,
        officerId: selectedOfficerId,
        nominatingDepartment
      });
      setIsError(false);
      setMessage(res.data.message);
      setSelectedOfficerId('');
      setSelectedProgrammeId('');
      setNominatingDepartment('');
    } catch (err: any) {
      setIsError(true);
      setMessage(err.response ? err.response.data.message : 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
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
                        {p.title} ({p.trainingDate})
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
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NominationForm;