export class MockTime {
    timeDifference: number;

    getCurrentDate(): Date {
        return new Date(this.getCurrentTime());
    }

    getCurrentTime(): number {
        return Date.now() - this.timeDifference;
    }

    constructor(date: Date = new Date()) {
        this.timeDifference = Date.now() - date.getTime();
    }
}