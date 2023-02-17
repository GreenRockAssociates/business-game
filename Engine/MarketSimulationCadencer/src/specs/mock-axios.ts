export class MockAxios {
    get: jest.Mock;

    constructor() {
        this.get = jest.fn();
    }
}