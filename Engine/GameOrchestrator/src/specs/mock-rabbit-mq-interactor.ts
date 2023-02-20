export class MockRabbitMqInteractor {
    sendToGameStartQueue: jest.Mock;

    constructor() {
        this.sendToGameStartQueue = jest.fn();
    }
}