import { model, Schema } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const notesSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    content: {
      type: String,
      trim: true,
      required: false,
      default: '',
    },
    tag: {
      type: String,
      default: 'Todo',
      enum: [...TAGS],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notesSchema.index({ title: 'text', content: 'text' });
export const Note = model('Note', notesSchema);
