import {NextFunction, Request, Response} from 'express';
import {AuthenticationService} from "../../libraries/authentication-service";

/**
 * Fetches the user session from the authentication service and populates req.session with a valid UUID
 *
 * If there is an issue (for instance, the user is not connected, or their session data is invalid) this middleware ends the chain
 * and doesn't call the next middleware
 */
export async function distantSession(req: Request, res: Response, next: NextFunction, authenticationService: AuthenticationService) {
    try {
        req.session = await authenticationService.getSessionData(req.headers);
        next()
        return;
    } catch (err: any) {
        // If an error occurred during the request, send the right error message back
        if (err.response){
            switch (err.response.status){
                case 401:
                    res.statusMessage = "Not authenticated";
                    res.sendStatus(401);
                    return;
                case 403:
                    res.sendStatus(403);
                    return;
                default:
                    res.sendStatus(500);
                    return;
            }
        } else {
            res.sendStatus(500);
            return;
        }
    }
}