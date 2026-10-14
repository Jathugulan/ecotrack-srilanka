import { Request, Response, NextFunction } from 'express';
import { Organization } from './organization.model.js';
import { sendSuccess } from '../../utils/response.js';

export async function getOrganizations(req: Request, res: Response, next: NextFunction) {
  try {
    const orgs = await Organization.find({ isActive: true });
    return sendSuccess(res, 'Organizations retrieved', orgs);
  } catch (error) {
    next(error);
  }
}

export async function createOrganization(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await Organization.create(req.body);
    return sendSuccess(res, 'Organization created', org, 201);
  } catch (error) {
    next(error);
  }
}
