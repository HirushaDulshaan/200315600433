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
  refreshKey: number;
  onCancelled: () => void;
}

function NominationsList({ programmeId, refreshKey, onCancelled }: Props) {
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

  const handleCancel = async (nominationId: number) => {
    setCancellingId(nominationId);
    setNotice('');
    try {
      const res = await axios.delete(`http://localhost:5000/api/nominations/${nominationId}`);
      setNotice(res.data.message);
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
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Officer</th>
                  <th>Department</th>
                  <th>Nominated By</th>
                  <th></th>
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
                        onClick={() => handleCancel(n.nominationId)}
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

            <h6 className="text-warning mt-4">Waiting List ({waiting.length})</h6>
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Officer</th>
                  <th>Department</th>
                  <th>Nominated By</th>
                  <th></th>
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
                        onClick={() => handleCancel(n.nominationId)}
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
          </>
        )}
      </div>
    </div>
  );
}

export default NominationsList;