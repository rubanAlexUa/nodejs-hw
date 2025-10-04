import createHttpError from 'http-errors';
import { Notes } from '../models/note.js';

export const getNotes = async (req, res) => {
  const notes = await Notes.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { NoteId } = req.params;
  const student = await Notes.findById(NoteId);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.status(200).json(student);
};

export const createNote = async (req, res) => {
  const { note } = await Notes.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = await req.params;
  const note = await Notes.findByIdAndDelete({ _id: noteId });

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).send(note);
};

export const patchNote = async (req, res, next) => {
  const { noteId } = await req.params;
  const note = await Notes.findByIdAndUpdate({ _id: noteId }, req.body, {
    new: true,
  });
  if (!note) {
    next.createHttpError(404, 'Note not found');
    return;
  }
  res.status(200).json(note);
};
