import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState('createdAt');
  const [direction, setDirection] = useState('asc');
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentNote, setCurrentNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchNotes(token);
    }
  }, [page, size, sort, direction]);

  const fetchNotes = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8082/api/v1/notes?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSort = (column) => {
    if (sort === column) {
      setDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(column);
      setDirection('asc');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!token) return;

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing
      ? `http://localhost:8082/api/v1/notes/${currentNote.id}`
      : 'http://localhost:8082/api/v1/notes';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: currentNote.title, content: currentNote.content }),
      });

      if (!response.ok) throw new Error('Failed to save note');
      fetchNotes(token);
      setCurrentNote(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await fetch(`http://localhost:8082/api/v1/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes(token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const startEditing = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const startCreating = () => {
    setCurrentNote({ title: '', content: '' });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    const time = new Date(dateString).toLocaleTimeString('pl-PL', options);
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString).toLocaleDateString('pl-PL', dateOptions);
    return `${time} | ${date}`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Notes</h2>
        <div style={styles.userInfo}>
          <span style={styles.welcomeText}>Witaj, {email}!</span>
          <FaSignOutAlt
            onClick={handleLogout}
            style={styles.logoutIcon}
            title="Wyloguj się"
          />
        </div>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : (
        <>
          {totalElements === 0 ? (
            <p style={styles.noNotes}>Brak notatek.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')} style={styles.header}>
                    Tytuł {sort === 'title' && (direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('content')} style={styles.header}>
                    Treść {sort === 'content' && (direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('createdAt')} style={styles.header}>
                    Data utworzenia {sort === 'createdAt' && (direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={styles.header}>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id} style={styles.row}>
                    <td style={styles.cell}>{note.title}</td>
                    <td style={styles.cell}>
                      <div style={styles.contentCell}>
                        <span className="content-text" title={note.content}>
                          {note.content.length > 50 ? `${note.content.substring(0, 47)}...` : note.content}
                        </span>
                      </div>
                    </td>
                    <td style={styles.cell}>{formatDate(note.createdAt)}</td>
                    <td style={styles.cell}>
                      <button
                        onClick={() => startEditing(note)}
                        style={styles.editButton}
                        title="Edytuj notatkę"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        style={styles.deleteButton}
                        title="Usuń notatkę"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={styles.pagination}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              style={{
                ...styles.pageButton,
                backgroundColor: page === 0 ? '#ccc' : '#3498db',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Poprzednia
            </button>
            <span style={styles.pageText}>
              Strona {page + 1} z {totalPages > 0 ? totalPages : 1}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={page === totalPages - 1 || totalPages === 0}
              style={{
                ...styles.pageButton,
                backgroundColor: page === totalPages - 1 || totalPages === 0 ? '#ccc' : '#3498db',
                cursor: page === totalPages - 1 || totalPages === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Następna
            </button>
          </div>
          <button onClick={startCreating} style={styles.addButton}>Dodaj nową notatkę</button>
          {currentNote && (
            <form onSubmit={handleSave} style={styles.form}>
              <h2 style={styles.formHeading}>{isEditing ? 'Edytuj notatkę' : 'Nowa notatka'}</h2>
              <label style={styles.label}>Tytuł</label>
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                style={styles.input}
              />
              <label style={styles.label}>Treść</label>
              <textarea
                value={currentNote.content}
                onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                style={styles.textarea}
              />
              <button type="submit" style={styles.saveButton}>
                Zapisz
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '20px',
  },
  noNotes: {
    fontStyle: 'italic',
    color: '#7f8c8d',
    textAlign: 'center',
    fontSize: '18px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  header: {
    padding: '12px',
    color: '#34495e',
    cursor: 'pointer',
    textAlign: 'left',
    backgroundColor: '#f1f1f1',
    fontSize: '16px',
    fontWeight: '500',
    borderBottom: '2px solid #ddd',
  },
  row: {
    borderBottom: '1px solid #f1f1f1',
  },
  cell: {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #f1f1f1',
  },
  contentCell: {
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  editButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#27ae60',
    marginRight: '10px',
    fontSize: '18px',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#e74c3c',
    fontSize: '18px',
  },
  loading: {
    fontSize: '18px',
    color: '#3498db',
    textAlign: 'center',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  pageButton: {
    padding: '10px 15px',
    fontSize: '14px',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  pageText: {
    fontSize: '16px',
    color: '#555',
  },
  addButton: {
    marginTop: '30px',
    padding: '12px 20px',
    color: '#fff',
    backgroundColor: '#2ecc71',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  form: {
    marginTop: '30px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  formHeading: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#34495e',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    fontSize: '16px',
    color: '#2c3e50',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    color: '#34495e',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    minHeight: '120px',
    color: '#34495e',
    resize: 'vertical',
  },
  saveButton: {
    padding: '12px 20px',
    color: '#fff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
  },
  welcomeText: {
    fontSize: '16px',
    color: '#34495e',
    marginRight: '10px',
  },
  logoutIcon: {
    cursor: 'pointer',
    color: '#e74c3c',
    fontSize: '20px',
    marginTop: '5px',
  },
};


export default NoteList;