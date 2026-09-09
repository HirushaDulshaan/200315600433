import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface EligibilityRule {
  ruleId: number;
  ruleType: string;
  ruleValue: string;
  programme: {
    programmeId: number;
    title: string;
  } | null;
}

interface Props {
  refreshKey: number;
  onRuleDeleted: () => void;
}

function EligibilityRulesList({ refreshKey, onRuleDeleted }: Props) {
  const [rules, setRules] = useState<EligibilityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await axios.get<EligibilityRule[]>('http://localhost:5000/api/eligibility-rules');
      setRules(res.data);
    } catch (err) {
      console.error('Failed to load eligibility rules', err);
      setLoadError('Failed to load eligibility rules. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRules();
  }, [fetchRules, refreshKey]);

  const handleDelete = async (ruleId: number, programmeTitle: string, ruleType: string) => {
    const confirmDelete = window.confirm(
      `Remove the ${ruleType} rule from "${programmeTitle}"?`
    );
    if (!confirmDelete) return;

    setDeleteError('');
    setDeletingId(ruleId);
    try {
      await axios.delete(`http://localhost:5000/api/eligibility-rules/${ruleId}`);
      onRuleDeleted();
    } catch (err: any) {
      console.error('Failed to delete rule', err);
      setDeleteError(
        err.response?.data?.message || 'Failed to remove this rule. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-muted">Loading rules...</p>;

  return (
    <div className="card shadow">
      <div className="card-body p-4">
        <h4 className="mb-3">Existing Eligibility Rules</h4>

        {loadError && <div className="alert alert-danger">{loadError}</div>}
        {deleteError && <div className="alert alert-danger">{deleteError}</div>}

        {!loadError && rules.length === 0 ? (
          <p className="text-muted">No eligibility rules added yet.</p>
        ) : rules.length > 0 ? (
          <div className="table-responsive" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table className="table table-sm table-bordered mb-0">
              <thead className="table-light" style={{ position: 'sticky', top: 0 }}>
                <tr>
                  <th>Programme</th>
                  <th>Rule Type</th>
                  <th>Rule Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rules.map(rule => {
                  const programmeTitle = rule.programme?.title ?? 'Unknown programme';
                  return (
                    <tr key={rule.ruleId}>
                      <td>{programmeTitle}</td>
                      <td><span className="badge bg-secondary">{rule.ruleType}</span></td>
                      <td>{rule.ruleValue}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(rule.ruleId, programmeTitle, rule.ruleType)}
                          disabled={deletingId === rule.ruleId}
                        >
                          {deletingId === rule.ruleId ? 'Removing...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EligibilityRulesList;