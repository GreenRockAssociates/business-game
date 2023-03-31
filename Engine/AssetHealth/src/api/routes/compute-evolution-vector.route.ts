import {Request, Response} from "express";
import {Repository} from "typeorm";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {AssetHealthEntity} from "../../../../DataSource/src/entities/asset-health.entity";
import {NewsReportEntity} from "../../../../DataSource/src/entities/news-report.entity";
import {
    COMPANY_RATING_TO_PROBABILITY_IMPACT_MAP,
    MAX_CONCURRENT_NEWS_PER_ASSET, MAX_NEWS_AGE
} from "../../constants/health.constants";
import {EvolutionVectorResponseDto} from "../../dto/evolution-vector-response.dto";
import {validateOrReject} from "class-validator";
import {GameIdAndCurrentTickDto} from "../../dto/game-id-and-current-tick.dto";

/**
 * Returns a value between 0 and 1 corresponding to how much of the news impact should be applied depending on its age.
 *
 * Used to smooth the news impact over time, and disable completely its impact after a certain number of ticks.
 * @param generatedTick
 * @param currentTick
 */
function newsPowerOverTime(generatedTick: number, currentTick: number): number {
    const newsAge = currentTick - generatedTick;
    if (newsAge > MAX_NEWS_AGE){
        return 0;
    }

    const x = newsAge/102.5;
    return (x / (Math.pow((x - 0.5), 2) + 0.75));
}

/**
 * Translates the [-10 ; 10] scale of the news impact to a smaller range of [-0.2 ; 0.2] compatible with the probability
 * @param influenceFactor
 */
function newsInfluenceFactorToRealImpact(influenceFactor: number): number {
    return influenceFactor / 50;
}

/**
 * Reduce the impact of the news to take into account the fact that it is not the most recent one
 * @param freshness
 */
function newsFreshnessPower(freshness: number): number {
    return 1 - (freshness / 3);
}

async function getNewsImpact(gameId: string, asset: AssetEntity, currentTick: number, newsReportRepository: Repository<NewsReportEntity>): Promise<number> {
    const latestNews: NewsReportEntity[] = await newsReportRepository.find({
        where: {
            assets: asset,
            game: {
                id: gameId
            }
        },
        order: {
            generatedTick: "DESC"
        },
        take: MAX_CONCURRENT_NEWS_PER_ASSET
    })

    let impact = 0;
    latestNews.forEach((newsReport, index) => {
        // For each news, compute its impact and scale it according to its age and position in the news cycle
        impact += newsPowerOverTime(newsReport.generatedTick, currentTick) * newsInfluenceFactorToRealImpact(newsReport.influenceFactor) * newsFreshnessPower(index);
    })

    return impact;
}

async function getHealthImpact(gameId: string, asset: AssetEntity, assetHealthRepository: Repository<AssetHealthEntity>) {
    const latestHealth: AssetHealthEntity = await assetHealthRepository.findOne({
        where: {
            asset: asset,
            game: {
                id: gameId
            }
        },
        order: {
            generatedTick: "DESC"
        }
    });

    if (!latestHealth) {
        return 0;
    }

    return COMPANY_RATING_TO_PROBABILITY_IMPACT_MAP.get(latestHealth.assetRating);
}

async function getGrowthProbability(gameId: string, asset: AssetEntity, currentTick: number, assetHealthRepository: Repository<AssetHealthEntity>, newsReportRepository: Repository<NewsReportEntity>): Promise<number> {
    const newsImpact: number = await getNewsImpact(gameId, asset, currentTick, newsReportRepository);
    const healthImpact: number = await getHealthImpact(gameId, asset, assetHealthRepository);

    return 0.5 + newsImpact + healthImpact;
}

export function computeEvolutionVectorRouteFactory(assetRepository: Repository<AssetEntity>, assetHealthRepository: Repository<AssetHealthEntity>, newsReportRepository: Repository<NewsReportEntity>){
    return async (req: Request, res: Response) => {
        const gameIdAndCurrentTickDto: GameIdAndCurrentTickDto = req.params as unknown as GameIdAndCurrentTickDto;

        const allAssets: AssetEntity[] = await assetRepository.find();

        let evolutionVector: Map<string, number> = new Map();
        await Promise.all(
            allAssets.map(async asset => {
                const growthProbability: number = await getGrowthProbability(gameIdAndCurrentTickDto.gameId, asset, Number.parseInt(gameIdAndCurrentTickDto.currentTick), assetHealthRepository, newsReportRepository);
                evolutionVector.set(asset.ticker, growthProbability);
            })
        );

        const response: EvolutionVectorResponseDto = new EvolutionVectorResponseDto(null, Number.parseInt(gameIdAndCurrentTickDto.currentTick));
        response.setEvolutionVector(evolutionVector);
        try {
            await validateOrReject(response);
            res.json(response);
        } catch (_){
            res.sendStatus(500);
        }
    }
}