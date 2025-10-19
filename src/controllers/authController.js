import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { createSession } from '../services/auth.js';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { setSessionCookie } from '../services/auth.js';

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createHttpError(404, 'Email in use'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);
  setSessionCookie(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(createHttpError(404, 'User not found'));
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return next(createHttpError(404, 'Password is not correct'));
  }

  await Session.deleteOne(user._id);

  const newSession = await createSession(user._id);
  setSessionCookie(res, newSession);

  res.status(200).json(user);
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(404).json({});
};

export const refreshUserSession = async (req, res, next) => {
  const session = await Session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  if (!session) {
    return next(createHttpError(404, 'Session is not found'));
  }

  const isSessionExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionExpired) {
    return next(createHttpError(404, 'Session token expires'));
  }

  await Session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookie(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};
