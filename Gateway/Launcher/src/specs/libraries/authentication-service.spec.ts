import {Axios, AxiosRequestConfig} from "axios";
import {AuthenticationService} from "../../libraries/authentication-service";

class AxiosMock {
    get(url: string, config?: AxiosRequestConfig<any>) {}
}

class helpers {
    static getValidSessionData(): { data: { userId: string } } {
        return {
            data: {
                userId: "ad06f2dc-0154-4e5d-bc93-ccc772c3e675"
            }
        }
    }

    static getInvalidSessionData(): { data: any } {
        return {
            data: {
                unknownField: "should not be there"
            }
        }
    }
}

describe("Authentication service", () => {
    let authenticationService: AuthenticationService;
    let axiosMock: AxiosMock;
    let axiosGetSpy: jest.SpyInstance;

    beforeEach(() => {
        axiosMock = new AxiosMock();
        axiosGetSpy = jest.spyOn(axiosMock, "get");
        authenticationService = new AuthenticationService(axiosMock as Axios);
    })

    describe("getSessionData", () => {
        it("Should call the right URL and echo the headers", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getValidSessionData())

            await authenticationService.getSessionData({echo: "true"});

            expect(axiosGetSpy).toHaveBeenCalledTimes(1)
            expect(axiosGetSpy).toHaveBeenCalledWith(`${process.env.BASE_SERVER_URL}${process.env.AUTHENTICATION_SERVICE_PREFIX}/session-data`, {headers: {echo: "true"}})
        })

        it("Should return the correct data in case of success", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getValidSessionData())

            const data = await authenticationService.getSessionData({echo: "true"});

            expect(data).toEqual(helpers.getValidSessionData().data)
        })

        it("Should throw if the distant session data is invalid", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getInvalidSessionData())

            await expect(authenticationService.getSessionData({})).rejects.not.toBeUndefined()
        })

        it("Should throw if the distant session data is invalid", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getInvalidSessionData())

            await expect(authenticationService.getSessionData({})).rejects.not.toBeUndefined()
        })

        it("Should propagate errors to the caller", async () => {
            axiosGetSpy.mockImplementation(() => {throw new Error("Http error")})

            await expect(authenticationService.getSessionData({})).rejects.toEqual(new Error("Http error"))
        })
    })
})