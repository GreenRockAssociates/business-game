import {AxiosInstance, AxiosRequestConfig} from "axios";
import {AuthenticationService} from "../../libraries/authentication.service";

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

    static getInvalidSessionData(invalidData: object): { data: any } {
        return {
            data: invalidData
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
        authenticationService = new AuthenticationService(axiosMock as AxiosInstance);
    })

    describe("getSessionData", () => {
        it("Should call the right URL and echo the cookies", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getValidSessionData())

            const cookie = "connect.sid=s%3AAPV3iI9ACXRxL1pXNkBqdHk12tb_YMN7.ojrh%2FUePwF3YBIlgCBeJp6sChHpbghjO782AsR58qGA";
            await authenticationService.getSessionData({cookie});

            expect(axiosGetSpy).toHaveBeenCalledTimes(1)
            expect(axiosGetSpy).toHaveBeenCalledWith(`${process.env.BASE_SERVER_URL}${process.env.AUTHENTICATION_SERVICE_PREFIX}/session-data`, {headers: {cookie}})
        })

        it("Should only echo the cookies header", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getValidSessionData())

            const cookie = "connect.sid=s%3AAPV3iI9ACXRxL1pXNkBqdHk12tb_YMN7.ojrh%2FUePwF3YBIlgCBeJp6sChHpbghjO782AsR58qGA";
            await authenticationService.getSessionData({cookie, 'other-header': 'echo'});

            expect(axiosGetSpy).toHaveBeenCalledTimes(1)
            expect(axiosGetSpy).toHaveBeenCalledWith(`${process.env.BASE_SERVER_URL}${process.env.AUTHENTICATION_SERVICE_PREFIX}/session-data`, {headers: {cookie}})
        })

        it("Should return the correct data in case of success", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getValidSessionData())

            const data = await authenticationService.getSessionData({echo: "true"});

            expect(data).toEqual(helpers.getValidSessionData().data)
        })

        it("Should throw if the distant session data is invalid", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getInvalidSessionData({
                unknownField: "should not be there"
            }))

            await expect(authenticationService.getSessionData({})).rejects.not.toBeUndefined()
        })

        it("Should throw if the distant user id is not a uuid", async () => {
            axiosGetSpy.mockImplementation(() => helpers.getInvalidSessionData({
                userId: "not a uuid"
            }))

            await expect(authenticationService.getSessionData({})).rejects.not.toBeUndefined()
        })

        it("Should propagate errors to the caller", async () => {
            axiosGetSpy.mockImplementation(() => {throw new Error("Http error")})

            await expect(authenticationService.getSessionData({})).rejects.toEqual(new Error("Http error"))
        })
    })
})