export class MockRequest {
    params: object;
    constructor(gameId?: string, assetTicker?: string) {
        this.params = {
            gameId: gameId,
            assetTicker: assetTicker
        }
    }
}