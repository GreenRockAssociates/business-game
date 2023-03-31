export class MockRabbitMqInteractor {
    sendToMarketStateQueue: jest.Mock

    constructor() {
        this.sendToMarketStateQueue = jest.fn();
    }
}