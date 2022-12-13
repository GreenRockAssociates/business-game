import {Request, Response, NextFunction} from "express";
import {randomUUID} from "crypto";

const csrfCookieName = 'XSRF-TOKEN';
const csrfHeaderName = 'X-XSRF-TOKEN';

/**
 * Only calls {next} if the request contains a matching cookie and header for csrf protection
 *
 * Doesn't apply to GET, HEAD and OPTIONS requests
 *
 * Always generates a new token that is stored as a cookie
 * @param req
 * @param res
 * @param next
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
    // Set a cookie for the next request in all cases
    setCsrfCookie(res);

    // Do not check CSRF protection on GET, HEAD and OPTIONS request as those aren't state changing
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        next();
        return;
    }

    // Get cookie and header values
    const csrfCookie = req.cookies[csrfCookieName];
    const csrfHeader = req.header(csrfHeaderName);

    // Ensure that both values are present
    if (!csrfCookie || !csrfHeader) {
        res.sendStatus(403);
        return;
    }

    // Ensure that they match
    if (csrfCookie !== csrfHeader) {
        res.sendStatus(403);
        return;
    }

    next();
}

function setCsrfCookie(res: Response): void {
    res.cookie(
        csrfCookieName,
        randomUUID(),
        {
            maxAge: 60*60*24*30, // 30 days
            secure: true,
            sameSite: true
        }
    )
}