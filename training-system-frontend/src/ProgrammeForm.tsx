import { useState, type FormEvent } from 'react';
import axios from 'axios';
import './ProgrammeForm.css';

interface Props {
  onProgrammeAdded: () => void;
}

// Helper to get today's date as YYYY-MM-DD for the min attribute
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

function ProgrammeForm({ onProgrammeAdded }: Props) {
  const [title, setTitle] = useState('');
  const [trainingDate, setTrainingDate] = useState('');
  const [venue, setVenue] = useState('');
  const [trainer, setTrainer] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const todayString = getTodayString();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    // Prevent past-date submission even if the browser's date picker was bypassed
    if (trainingDate < todayString) {
      setIsError(true);
      setMessage('Training date cannot be in the past.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/programmes', {
        title,
        trainingDate,
        venue,
        trainer,
        maxParticipants: Number(maxParticipants)
      });
      setIsError(false);
      setMessage(res.data.message);
      setTitle('');
      setTrainingDate('');
      setVenue('');
      setTrainer('');
      setMaxParticipants('');
      onProgrammeAdded();
    } catch (err: any) {
      setIsError(true);
      setMessage(err.response ? err.response.data.message : 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card custom-programme-card border-0 mb-4">
      {/* Header */}
      <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4 px-md-5">
        <div className="d-flex align-items-center gap-3">
          <div className="programme-icon-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
          </div>
          <div>
            <h4 className="card-title fw-bold mb-1 text-dark">Add Programme</h4>
            <p className="text-muted small mb-0">Create and schedule a new training session</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="card-body p-4 p-md-5">
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label-custom">Programme Title</label>
            <input
              type="text"
              className="form-control form-control-lg custom-input"
              placeholder="e.g. Leadership Development Workshop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label-custom">Training Date</label>
              <input
                type="date"
                className="form-control form-control-lg custom-input"
                value={trainingDate}
                min={todayString}
                onChange={(e) => setTrainingDate(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Max Participants</label>
              <input
                type="number"
                className="form-control form-control-lg custom-input"
                min="1"
                placeholder="e.g. 30"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label-custom">Venue</label>
            <input
              type="text"
              className="form-control form-control-lg custom-input"
              placeholder="e.g. Main Auditorium or Virtual Meeting"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label-custom mb-0">Trainer</label>
              <span className="badge bg-light text-secondary border font-normal">Optional</span>
            </div>
            <input
              type="text"
              className="form-control form-control-lg custom-input"
              placeholder="e.g. Dr. S. Fernando"
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn custom-programme-btn w-100 py-3"
              disabled={loading}
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Scheduling Programme...</span>
                </div>
              ) : (
                'Add Programme'
              )}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`alert custom-alert d-flex align-items-center mt-4 mb-0 ${
              isError ? 'alert-danger border-0' : 'alert-success border-0'
            }`}
            role="alert"
          >
            <span className="me-2">{isError ? '⚠️' : '✅'}</span>
            <div>{message}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgrammeForm;