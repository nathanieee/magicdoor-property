const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote
} = require('../controllers/notesController');

// Notes routes - Public endpoints for demo feature
// NOTE: No authentication required - this is intentional for the notes demo feature
router.route('/')
  .post(createNote)
  .get(getNotes);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
