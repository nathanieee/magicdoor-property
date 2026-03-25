const request = require('supertest');
const app = require('../app');
const { resetNotes } = require('../controllers/notesController');

// Test suite for notesController
describe('NotesController Tests', () => {
  beforeEach(() => {
    // Reset notes before each test
    resetNotes();
  });

  describe('POST /api/notes', () => {
    test('should create a new note', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({
          title: 'Test Note',
          content: 'This is a test note content'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Note');
      expect(response.body.data.content).toBe('This is a test note content');
      expect(response.body.data).toHaveProperty('createdAt');
      expect(response.body.data).toHaveProperty('updatedAt');
    });

    test('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({
          content: 'Content without title'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Title and content are required');
    });

    test('should return 400 when content is missing', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({
          title: 'Title without content'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Title and content are required');
    });

    test('should return 400 when both title and content are missing', async () => {
      const response = await request(app)
        .post('/api/notes')
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('GET /api/notes', () => {
    test('should return empty array when no notes exist', async () => {
      const response = await request(app)
        .get('/api/notes');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    test('should return all notes', async () => {
      // Create multiple notes
      await request(app)
        .post('/api/notes')
        .send({ title: 'Note 1', content: 'Content 1' });

      await request(app)
        .post('/api/notes')
        .send({ title: 'Note 2', content: 'Content 2' });

      const response = await request(app)
        .get('/api/notes');

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/notes/:id', () => {
    test('should return a single note by ID', async () => {
      const createResponse = await request(app)
        .post('/api/notes')
        .send({ title: 'Test Note', content: 'Test Content' });

      const noteId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/notes/${noteId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(noteId);
      expect(response.body.data.title).toBe('Test Note');
    });

    test('should return 404 when note does not exist', async () => {
      const response = await request(app)
        .get('/api/notes/99999');

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Note not found');
    });
  });

  describe('PUT /api/notes/:id', () => {
    test('should update note title', async () => {
      const createResponse = await request(app)
        .post('/api/notes')
        .send({ title: 'Original Title', content: 'Content' });

      const noteId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .send({ title: 'Updated Title' });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.content).toBe('Content');
      expect(response.body.data.updatedAt).not.toBe(createResponse.body.data.updatedAt);
    });

    test('should update note content', async () => {
      const createResponse = await request(app)
        .post('/api/notes')
        .send({ title: 'Title', content: 'Original Content' });

      const noteId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .send({ content: 'Updated Content' });

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Title');
      expect(response.body.data.content).toBe('Updated Content');
    });

    test('should update both title and content', async () => {
      const createResponse = await request(app)
        .post('/api/notes')
        .send({ title: 'Original', content: 'Original' });

      const noteId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .send({ title: 'New Title', content: 'New Content' });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.title).toBe('New Title');
      expect(response.body.data.content).toBe('New Content');
    });

    test('should return 400 when no fields provided', async () => {
      const createResponse = await request(app)
        .post('/api/notes')
        .send({ title: 'Title', content: 'Content' });

      const noteId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/notes/${noteId}`)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Title or content is required');
    });

    test('should return 404 when note does not exist', async () => {
      const response = await request(app)
        .put('/api/notes/99999')
        .send({ title: 'Updated' });

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Note not found');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    test('should delete a note', async () => {
      const createResponse = await request(app)
        .post('/api/notes')
        .send({ title: 'To Delete', content: 'Content' });

      const noteId = createResponse.body.data.id;

      const deleteResponse = await request(app)
        .delete(`/api/notes/${noteId}`);

      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.data.id).toBe(noteId);

      // Verify note is deleted
      const getResponse = await request(app)
        .get(`/api/notes/${noteId}`);

      expect(getResponse.statusCode).toBe(404);
    });

    test('should return 404 when deleting non-existent note', async () => {
      const response = await request(app)
        .delete('/api/notes/99999');

      expect(response.statusCode).toBe(404);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toContain('Note not found');
    });
  });
});
