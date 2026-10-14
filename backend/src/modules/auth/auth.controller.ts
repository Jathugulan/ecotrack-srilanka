import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../users/user.model.js';
import { env } from '../../config/env.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { AuthenticatedRequest, AuthUserPayload } from '../../types/index.js';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must have at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredLanguage: z.enum(['en', 'si', 'ta']).default('en'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

function generateTokens(payload: AuthUserPayload) {
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, phone, password, preferredLanguage } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'An account with this email already exists', 409, 'EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      phone,
      passwordHash,
      role: 'RESIDENT', // Public registrations are strictly RESIDENT
      preferredLanguage: preferredLanguage || 'en',
    });

    const tokenPayload: AuthUserPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
    };

    const { accessToken, refreshToken } = generateTokens(tokenPayload);

    return sendSuccess(
      res,
      'Registration successful',
      {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
        },
        accessToken,
        refreshToken,
      },
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('organizationId');
    if (!user) {
      return sendError(res, 'Invalid email or password credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      return sendError(res, 'Account is deactivated. Please contact support.', 403, 'ACCOUNT_INACTIVE');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials', 401, 'INVALID_CREDENTIALS');
    }

    const tokenPayload: AuthUserPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId ? (user.organizationId as any)._id.toString() : undefined,
      preferredLanguage: user.preferredLanguage,
    };

    const { accessToken, refreshToken } = generateTokens(tokenPayload);

    return sendSuccess(res, 'Authentication successful', {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organizationId: user.organizationId,
        preferredLanguage: user.preferredLanguage,
        profileImage: user.profileImage,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const user = await User.findById(req.user.userId)
      .select('-passwordHash')
      .populate('organizationId')
      .populate('serviceZoneId');

    if (!user) {
      return sendError(res, 'User record not found', 404);
    }

    return sendSuccess(res, 'Profile retrieved', user);
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken: incomingToken } = req.body;
    if (!incomingToken) {
      return sendError(res, 'Refresh token required', 400);
    }

    const decoded = jwt.verify(incomingToken, env.JWT_REFRESH_SECRET) as AuthUserPayload;
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return sendError(res, 'Invalid user session', 401);
    }

    const tokenPayload: AuthUserPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId ? user.organizationId.toString() : undefined,
      preferredLanguage: user.preferredLanguage,
    };

    const tokens = generateTokens(tokenPayload);
    return sendSuccess(res, 'Tokens refreshed successfully', tokens);
  } catch (error) {
    return sendError(res, 'Invalid refresh token', 401, 'INVALID_TOKEN');
  }
}
