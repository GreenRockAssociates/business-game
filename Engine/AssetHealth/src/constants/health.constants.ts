export const COMPANY_RATING_VALUES = ["AAA", "AA", "A", "B", "C", "D", "E", "F"];

const computeProbabilityImpact = (value: number) => value * 0.02
export const COMPANY_RATING_TO_PROBABILITY_IMPACT_MAP = new Map<string, number>([
    ["AAA", computeProbabilityImpact(5)],
    ["AA", computeProbabilityImpact(3)],
    ["A", computeProbabilityImpact(2)],
    ["B", computeProbabilityImpact(1)],
    ["C", computeProbabilityImpact(0)],
    ["D", computeProbabilityImpact(-1)],
    ["E", computeProbabilityImpact(-2)],
    ["F", computeProbabilityImpact(-3)]
]);

export const MAX_CONCURRENT_NEWS_PER_ASSET = 3;
export const MAX_NEWS_AGE = 840;