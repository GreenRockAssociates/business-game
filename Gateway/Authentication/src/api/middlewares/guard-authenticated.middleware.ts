import { Request, Response, NextFunction } from 'express';

/**
 * Calls {next} only if the user currently has a session
 */
export async function guardAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.data) {
        next();
    } else {
        res.statusMessage = "Not authenticated";
        res.sendStatus(401);
    }
}