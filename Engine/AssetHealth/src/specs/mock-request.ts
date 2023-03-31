class Params {
    gameId?: string;
    assetTicker?: string;
    currentTick?: number;
}

class Body {
    currentTick?: number;
}

export class MockRequest {
    params: object;
    body: object;

    constructor(params?: Params, body?: Body) {
        this.params = params;
        this.body = body;
    }
}