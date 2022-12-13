import {Request, Response} from "express";
import {sessionData} from "../../api/routes/session-data.route";


describe("Session data route", () => {
    const response = {
        sendStatus() {},
        status() {},
        send() {}
    };
    let sendStatusSpy: jest.SpyInstance;
    let statusSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;

    beforeAll(async () => {
        sendStatusSpy = jest.spyOn(response, 'sendStatus');
        statusSpy = jest.spyOn(response, 'status');
        sendSpy = jest.spyOn(response, 'send');
    })

    afterEach(async () => {
        jest.clearAllMocks();
    })

    it("Should return the correct information about the user if they are connected", async () => {
        const userId = "f782413a-8af2-4547-aa71-9f90eddca4e5"
        const request = {session: {data: {userId}}};
        await sessionData(request as Request, response as unknown as Response);

        expect(statusSpy).toHaveBeenCalledWith(200);
        expect(sendSpy).toHaveBeenCalledWith(`{"userId":"${userId}"}`);
        expect(sendStatusSpy).not.toHaveBeenCalled()
    })

    it("Should only send the data explicitly allowed by the DTO even if the session contains more things", async () => {
        const userId = "f782413a-8af2-4547-aa71-9f90eddca4e5"
        const request = {
            session: {
                data: {
                    userId,
                    secret: "super secret value"
                }
            }
        };
        await sessionData(request as unknown as Request, response as unknown as Response);

        expect(statusSpy).toHaveBeenCalledWith(200);
        expect(sendSpy).toHaveBeenCalledWith(`{"userId":"${userId}"}`);
        expect(sendStatusSpy).not.toHaveBeenCalled()
    })

    it("Should return 401 if the user is not connected", async () => {
        const request = {session: {}};
        await sessionData(request as Request, response as unknown as Response);

        expect(statusSpy).not.toHaveBeenCalledWith();
        expect(sendSpy).not.toHaveBeenCalledWith();
        expect(sendStatusSpy).toHaveBeenCalledWith(401)
    })

    it("Should return 401 if the user has an invalid session", async () => {
        const userId = "not a uuid"
        const request = {session: {data: {userId}}};
        await sessionData(request as Request, response as unknown as Response);

        expect(statusSpy).not.toHaveBeenCalledWith();
        expect(sendSpy).not.toHaveBeenCalledWith();
        expect(sendStatusSpy).toHaveBeenCalledWith(401)
    })
})