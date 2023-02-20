export class MockAxios {
    post: jest.Mock;

    constructor() {
        this.post = jest.fn();
    }
}