import {
  getNotes,
  getNoteById,
  createNote,
  deleteNote,
  patchNote,
} from '../controllers/notesController.js';
import { Router } from 'express';

const notesRouter = new Router();

notesRouter.get('/notes', getNotes);
notesRouter.get('notes/:noteId', getNoteById);
notesRouter.post('notes', createNote);
notesRouter.delete('notes/:noteId', deleteNote);
notesRouter.patch('notes/:noteId', patchNote);

export default notesRouter;
