import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ContentCard from "../components/ContentCard";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://127.0.0.1:5000/admin/users", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        } else {
          console.error("Failed to fetch users", await res.text());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <PageHeader title="Users" subtitle="Manage platform users" />
      <ContentCard>
        {loading ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: 'var(--text-muted)',
            fontSize: '14px'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <i className="fa fa-spinner fa-spin" style={{ fontSize: '24px', color: 'var(--primary)' }}></i>
            </div>
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div style={{ 
            padding: '60px 40px', 
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>
              <i className="fa fa-users"></i>
            </div>
            <p style={{ fontSize: '16px', margin: 0 }}>No users found</p>
            <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
              Users will appear here once they register
            </p>
          </div>
        ) : (
          <div style={{ 
            overflowX: 'auto', 
            overflowY: 'auto',
            maxHeight: '500px'
          }}>
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ 
                    fontWeight: '600', 
                    fontSize: '13px', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'var(--text-muted)',
                    paddingBottom: '16px'
                  }}>
                    User
                  </th>
                  <th style={{ 
                    fontWeight: '600', 
                    fontSize: '13px', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'var(--text-muted)',
                    paddingBottom: '16px'
                  }}>
                    Email
                  </th>
                  <th style={{ 
                    fontWeight: '600', 
                    fontSize: '13px', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'var(--text-muted)',
                    paddingBottom: '16px',
                    textAlign: 'center'
                  }}>
                    Verified News
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr 
                    key={u.id}
                    style={{ 
                      transition: 'background 0.2s ease',
                      animation: `fadeIn 0.3s ease ${idx * 0.05}s backwards`
                    }}
                  >
                    <td style={{ paddingTop: '16px', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#fff',
                          flexShrink: 0
                        }}>
                          {(u.full_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-main)' }}>
                          {u.full_name || 'Unknown User'}
                        </div>
                      </div>
                    </td>
                    <td style={{ 
                      paddingTop: '16px', 
                      paddingBottom: '16px',
                      color: 'var(--text-muted)',
                      fontSize: '14px'
                    }}>
                      {u.email}
                    </td>
                    <td style={{ 
                      paddingTop: '16px', 
                      paddingBottom: '16px',
                      textAlign: 'center'
                    }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: 'var(--primary)',
                        fontSize: '14px',
                        fontWeight: '600',
                        minWidth: '60px'
                      }}>
                        {u.verified_count ?? 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ContentCard>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
