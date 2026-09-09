import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';

interface TrainingProgramme {
  programmeId: number;
  title: string;
  trainingDate: string;
  venue: string;
  maxParticipants: number;
}

const ruleTypes = [
  { value: 'DEPARTMENT', label: 'Department (comma-separated, e.g. Finance,Budget,Planning)' },
  { value: 'GRADE', label: 'Grade (comma-separated, e.g. Senior,Assistant Director)' },
  { value: 'MIN_YEARS_SERVICE', label: 'Minimum Years of Service (number, e.g. 3)' },
];

interface Props {
  onRuleAdded: () => void;
}

function EligibilityRuleForm({ onRuleAdded }: Props) {
  const [programmes, setProgrammes] = useState<TrainingProgramme[]>([]);
  const [programmesError, setProgrammesError] = useState('');
  const [programmeId, setProgrammeId] = useState('');
  const [ruleType, setRuleType] = useState('');
  const [ruleValue, setRuleValue] = useState('');

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/programmes')
      .then(res => setProgrammes(res.data))
      .catch(err => {
        console.error('Failed to load programmes', err);
        setProgrammesError('Failed to load training programmes. Please refresh the page.');
      });
  }, []);

  const validate = (): string | null => {
    if (!programmeId) return 'Please select a training programme.';
    if (!ruleType) return 'Please select a rule type.';

    const trimmedValue = ruleValue.trim();
    if (!trimmedValue) return 'Rule value is required.';

    if (ruleType === 'MIN_YEARS_SERVICE') {
      const years = Number(trimmedValue);
      if (!Number.isInteger(years) || years < 0) {
        return 'Minimum Years of Service must be a whole number (0 or greater).';
      }
    }

    if (ruleType === 'DEPARTMENT' || ruleType === 'GRADE') {
      const values = trimmedValue.split(',').map(v => v.trim()).filter(v => v.length > 0);
      if (values.length === 0) {
        return 'Please enter at least one value, comma-separated.';
      }
    }

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    const validationError = validate();
    if (validationError) {
      setIsError(true);
      setMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/eligibility-rules', {
        programmeId: Number(programmeId),
        ruleType,
        ruleValue: ruleValue.trim(),
      });
      setIsError(false);
      setMessage(res.data.message);
      setRuleType('');
      setRuleValue('');
      onRuleAdded();
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
        <h4 className="mb-3">Add Eligibility Rule</h4>

        {programmesError && <div className="alert alert-danger">{programmesError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Training Programme</label>
            <select
              className="form-select"
              value={programmeId}
              onChange={(e) => setProgrammeId(e.target.value)}
              required
              disabled={programmes.length === 0}
            >
              <option value="">-- Select Programme --</option>
              {programmes.map(p => (
                <option key={p.programmeId} value={p.programmeId}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Rule Type</label>
            <select
              className="form-select"
              value={ruleType}
              onChange={(e) => {
                setRuleType(e.target.value);
                setRuleValue('');
              }}
              required
            >
              <option value="">-- Select Rule Type --</option>
              {ruleTypes.map(rt => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Rule Value</label>
            <input
              type={ruleType === 'MIN_YEARS_SERVICE' ? 'number' : 'text'}
              min={ruleType === 'MIN_YEARS_SERVICE' ? 0 : undefined}
              className="form-control"
              placeholder={
                ruleType === 'MIN_YEARS_SERVICE'
                  ? 'e.g. 3'
                  : 'e.g. Finance,Budget,Planning'
              }
              value={ruleValue}
              onChange={(e) => setRuleValue(e.target.value)}
              required
            />
            <div className="form-text">
              For Department/Grade rules, separate multiple values with commas.
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Adding...' : 'Add Rule'}
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

export default EligibilityRuleForm;