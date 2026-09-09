import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface Officer {
  officerId: number;
  name: string;
  nic: string;
  department: string;
}

interface Props {
  refreshKey: number;
}

function OfficerList({ refreshKey }: Props) {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get<Officer[]>('http://localhost:5000/api/officers');
      setOfficers(res.data);
    } catch (err) {
      setError('Failed to load officers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers, refreshKey]);

  if (loading) return <p>Loading officers...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow">
      <div className="card-body p-4">
        <h4 className="mb-3">Officers List</h4>
        {officers.length === 0 ? (
          <p className="text-muted">No officers found.</p>
        ) : (
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>NIC</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((officer, idx) => (
                  <tr key={officer.officerId}>
                    <td>{idx + 1}</td>
                    <td>{officer.name}</td>
                    <td>{officer.nic}</td>
                    <td>{officer.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OfficerList;