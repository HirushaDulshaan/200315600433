import { useState, type FormEvent } from 'react';
import axios from 'axios';

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
    <div className="card shadow mb-4">
      <div className="card-body p-4">
        <h4 className="mb-3">Add Training Programme</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Leadership Development Workshop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Training Date</label>
            <input
              type="date"
              className="form-control"
              value={trainingDate}
              min={todayString}
              onChange={(e) => setTrainingDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Venue</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Main Auditorium"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Trainer</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Dr. S. Fernando"
              value={trainer}
              onChange={(e) => setTrainer(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Max Participants</label>
            <input
              type="number"
              className="form-control"
              min="1"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? 'Adding...' : 'Add Programme'}
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

export default ProgrammeForm;