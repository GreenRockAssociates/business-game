export class MockRabbitMqInteractor {
    initialize: jest.Mock;
    registerListeners: jest.Mock;
    sendToMarketSimulateQueue: jest.Mock;

    constructor() {
        this.initialize = jest.fn();
        this.registerListeners = jest.fn();
        this.sendToMarketSimulateQueue = jest.fn();
    }
}