import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: String,
      requires: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: String,
      required: true,
    },
    refreshTokenValidUntil: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Session = model('Session', sessionSchema);
