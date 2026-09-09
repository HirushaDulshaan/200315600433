import { useState, type FormEvent } from 'react';
import axios from 'axios';

const departments = [
  'Finance', 'Administration', 'Human Resources', 'IT', 'Procurement',
  'Legal', 'Planning', 'Audit', 'Engineering', 'Health Services'
];

const grades = ['Junior', 'Senior', 'Assistant Director', 'Director'];

interface Props {
  onOfficerAdded: () => void;
}

function OfficerForm({ onOfficerAdded }: Props) {
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [department, setDepartment] = useState('');
  const [grade, setGrade] = useState('');
  const [dateJoined, setDateJoined] = useState('');

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/officers', {
        name, nic, department, grade, dateJoined
      });
      setIsError(false);
      setMessage(res.data.message);
      setName('');
      setNic('');
      setDepartment('');
      setGrade('');
      setDateJoined('');
      onOfficerAdded();
    } catch (err: any) {
      setIsError(true);
      setMessage(err.response ? err.response.data.message : 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-body p-4">
        <h4 className="mb-3">Add New Officer</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Officer Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. A. Perera"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">NIC Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 198512345678"
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Grade</label>
            <select
              className="form-select"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            >
              <option value="">-- Select Grade --</option>
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Date Joined</label>
            <input
              type="date"
              className="form-control"
              value={dateJoined}
              onChange={(e) => setDateJoined(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Adding...' : 'Add Officer'}
          </button>
        </form>

        {message && (
          <div className={`alert mt-3 ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default OfficerForm;