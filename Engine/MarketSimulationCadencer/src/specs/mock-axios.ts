export class MockAxios {
    get: jest.Mock;
    post: jest.Mock;

    constructor() {
        this.get = jest.fn();
        this.post = jest.fn();
    }
}