import { useState, useEffect } from 'react';
import axios from 'axios';

interface Nomination {
  nominationId: number;
  officer: { officerId: number; name: string; department: string };
  nominatingDepartment: string;
  status: 'CONFIRMED' | 'WAITING';
  nominatedDate: string;
}

interface Props {
  programmeId: number;
  programmeTitle: string;
  refreshKey: number;
  onCancelled: () => void;
}

function NominationsList({ programmeId, programmeTitle, refreshKey, onCancelled }: Props) {
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [notice, setNotice] = useState<string>('');

  const fetchNominations = () => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/nominations/${programmeId}`)
      .then(res => setNominations(res.data))
      .catch(err => console.error('Failed to load nominations', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNominations();
  }, [programmeId, refreshKey]);

  const handleCancel = async (nominationId: number, officerName: string) => {
    const confirmCancel = window.confirm(
      `Cancel ${officerName}'s nomination for "${programmeTitle}"?`
    );
    if (!confirmCancel) return;

    setCancellingId(nominationId);
    setNotice('');
    try {
      const res = await axios.delete(`http://localhost:5000/api/nominations/${nominationId}`);
      setNotice(`${officerName}'s nomination for "${programmeTitle}" was cancelled. ${res.data.message}`);
      onCancelled();
    } catch (err: any) {
      setNotice(err.response ? err.response.data.message : 'Error cancelling nomination.');
    } finally {
      setCancellingId(null);
    }
  };

  const confirmed = nominations.filter(n => n.status === 'CONFIRMED');
  const waiting = nominations.filter(n => n.status === 'WAITING');

  return (
    <div className="card shadow">
      <div className="card-body p-4">
        <h4 className="mb-3">Nominations for this Programme</h4>

        {notice && <div className="alert alert-info">{notice}</div>}

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : nominations.length === 0 ? (
          <p className="text-muted">No nominations yet for this programme.</p>
        ) : (
          <>
            <h6 className="text-success">Confirmed ({confirmed.length})</h6>
            <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table className="table table-sm table-bordered mb-0" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                  <tr>
                    <th style={{ width: '30%' }}>Officer</th>
                    <th style={{ width: '25%' }}>Department</th>
                    <th style={{ width: '25%' }}>Nominated By</th>
                    <th style={{ width: '20%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {confirmed.map(n => (
                    <tr key={n.nominationId}>
                      <td>{n.officer.name}</td>
                      <td>{n.officer.department}</td>
                      <td>{n.nominatingDepartment}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancel(n.nominationId, n.officer.name)}
                          disabled={cancellingId === n.nominationId}
                        >
                          {cancellingId === n.nominationId ? 'Cancelling...' : 'Cancel'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {confirmed.length === 0 && (
                    <tr><td colSpan={4} className="text-muted">No confirmed nominations.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <h6 className="text-warning mt-4">Waiting List ({waiting.length})</h6>
            <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table className="table table-sm table-bordered mb-0" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
                  <tr>
                    <th style={{ width: '10%' }}>#</th>
                    <th style={{ width: '25%' }}>Officer</th>
                    <th style={{ width: '20%' }}>Department</th>
                    <th style={{ width: '25%' }}>Nominated By</th>
                    <th style={{ width: '20%' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {waiting.map((n, index) => (
                    <tr key={n.nominationId}>
                      <td>{index + 1}</td>
                      <td>{n.officer.name}</td>
                      <td>{n.officer.department}</td>
                      <td>{n.nominatingDepartment}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleCancel(n.nominationId, n.officer.name)}
                          disabled={cancellingId === n.nominationId}
                        >
                          {cancellingId === n.nominationId ? 'Cancelling...' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {waiting.length === 0 && (
                    <tr><td colSpan={5} className="text-muted">No one on the waiting list.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NominationsList;