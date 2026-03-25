import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL - uses relative path for Vite proxy in development
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Fetch all notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/notes`);
      setNotes(response.data.data);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        // Update existing note
        const response = await axios.put(`${API_URL}/notes/${editingId}`, formData);
        setNotes(notes.map(note =>
          note.id === editingId ? response.data.data : note
        ));
        setEditingId(null);
      } else {
        // Create new note
        const response = await axios.post(`${API_URL}/notes`, formData);
        setNotes([...notes, response.data.data]);
      }
      setFormData({ title: '', content: '' });
    } catch (err) {
      setError(editingId ? 'Failed to update note' : 'Failed to create note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content });
    setEditingId(note.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to delete note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', content: '' });
  };

  return (
    <section id="notes">
      <h1>NOTES</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="notes-container">
        {/* Create/Edit Form */}
        <div className="notes-form">
          <h2>{editingId ? 'Edit Note' : 'Create New Note'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows="5"
                disabled={loading}
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Note' : 'Create Note'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Notes List */}
        <div className="notes-list">
          <h2>All Notes ({notes.length})</h2>
          {loading && !editingId ? <p>Loading...</p> : null}
          {notes.length === 0 ? (
            <p>No notes yet. Create your first note!</p>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <div key={note.id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <div className="note-meta">
                    <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
                    {note.updatedAt !== note.createdAt && (
                      <small>Updated: {new Date(note.updatedAt).toLocaleString()}</small>
                    )}
                  </div>
                  <div className="note-actions">
                    <button onClick={() => handleEdit(note)}>Edit</button>
                    <button onClick={() => handleDelete(note.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Notes;
