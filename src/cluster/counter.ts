export default class RoundRobinCounter {
    private count: number;

    constructor(private limit: number) {
        this.count = 0;
    }

    increment() {
        const current = this.count;
        const next = this.count + 1;
        this.count = next === this.limit ? 0 : next;

        return current;
    }
}
