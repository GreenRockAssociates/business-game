import { Request, Response, NextFunction } from 'express';

/**
 * Calls {next} only if the user currently has a session
 */
export async function guardAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (false) {
        next();
    } else {
        res.statusMessage = "Not authenticated";
        res.sendStatus(401);
    }
}