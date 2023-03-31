export class NormalDistribution {
    private static boxMullerTransform() {
        const u1 = Math.random();
        const u2 = Math.random();

        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

        return { z0, z1 };
    }

     static generate(mean: number, stddev: number) {
        const { z0 } = this.boxMullerTransform();

        return z0 * stddev + mean;
    }
}