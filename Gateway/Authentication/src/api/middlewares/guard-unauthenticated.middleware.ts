import { Request, Response, NextFunction } from 'express';

/**
 * Calls {next} only if the user currently doesn't have a session
 */
export async function guardUnauthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.session.data) {
        next();
    } else {
        res.statusMessage = "Already authenticated";
        res.sendStatus(401);
    }
}