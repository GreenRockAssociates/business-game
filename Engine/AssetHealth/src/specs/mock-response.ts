export class MockResponse {
    json(){}
    sendStatus(){}
}

export function getMockResponseSpies(mock: MockResponse): { jsonSpy: jest.SpyInstance; sendStatusSpy: jest.SpyInstance} {
    return {
        jsonSpy: jest.spyOn(mock, "json"),
        sendStatusSpy: jest.spyOn(mock, "sendStatus")
    };
}