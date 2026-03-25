const { catchAsync, NotFoundError, ValidationError } = require('../utils/errorHandler');

// In-memory storage
let notes = [];
let nextId = 1;

const generateId = () => String(nextId++);

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Public
 */
exports.createNote = catchAsync(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    throw new ValidationError('Title and content are required');
  }

  const note = {
    id: generateId(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  notes.push(note);

  res.status(201).json({
    success: true,
    data: note
  });
});

/**
 * @desc    Get all notes
 * @route   GET /api/notes
 * @access  Public
 */
exports.getNotes = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
});

/**
 * @desc    Get a single note by ID
 * @route   GET /api/notes/:id
 * @access  Public
 */
exports.getNote = catchAsync(async (req, res) => {
  const note = notes.find(n => n.id === req.params.id);

  if (!note) {
    throw new NotFoundError('Note');
  }

  res.status(200).json({
    success: true,
    data: note
  });
});

/**
 * @desc    Update a note
 * @route   PUT /api/notes/:id
 * @access  Public
 */
exports.updateNote = catchAsync(async (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === req.params.id);

  if (noteIndex === -1) {
    throw new NotFoundError('Note');
  }

  const { title, content } = req.body;

  if (!title && !content) {
    throw new ValidationError('Title or content is required');
  }

  notes[noteIndex] = {
    ...notes[noteIndex],
    ...(title && { title }),
    ...(content && { content }),
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    data: notes[noteIndex]
  });
});

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Public
 */
exports.deleteNote = catchAsync(async (req, res) => {
  const noteIndex = notes.findIndex(n => n.id === req.params.id);

  if (noteIndex === -1) {
    throw new NotFoundError('Note');
  }

  const deletedNote = notes.splice(noteIndex, 1)[0];

  res.status(200).json({
    success: true,
    data: deletedNote
  });
});

/**
 * Helper functions for testing
 */
exports.getNotesArray = () => notes;
exports.resetNotes = () => {
  notes = [];
  nextId = 1;
};
