import { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';

interface FormData {
  programmeId: string;
  officerId: string;
  nominatingDepartment: string;
}

function NominationForm() {
  const [formData, setFormData] = useState<FormData>({
    programmeId: '',
    officerId: '',
    nominatingDepartment: ''
  });
  const [message, setMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/nominations', formData);
      setIsError(false);
      setMessage(res.data.message);
      setFormData({ programmeId: '', officerId: '', nominatingDepartment: '' });
    } catch (err: any) {
      setIsError(true);
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage('Error connecting to server.');
      }
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
                  <label className="form-label">Programme ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="programmeId"
                    placeholder="Enter Programme ID"
                    value={formData.programmeId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Officer ID</label>
                  <input
                    type="text"
                    className="form-control"
                    name="officerId"
                    placeholder="Enter Officer ID"
                    value={formData.officerId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nominating Department</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nominatingDepartment"
                    placeholder="e.g. Finance"
                    value={formData.nominatingDepartment}
                    onChange={handleChange}
                    required
                  />
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