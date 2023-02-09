import {Repository} from "typeorm";
import {NewsReportEntity} from "../../../../DataSource/src/entities/news-report.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {Request, Response} from "express";
import {INewsGenerator} from "../../libraries/news-templates";
import {GameIdDto} from "../../dto/game-id.dto";
import {CurrentTickDto} from "../../dto/current-tick.dto";
import {selectRandomItemFromList} from "../../libraries/select-random-item-from-list";

class GameNotFoundError{}

async function findGame(gameId: string, gameRepository: Repository<GameEntity>): Promise<GameEntity> {
    const gameEntity: GameEntity = await gameRepository.findOne({
        where: {
            id: gameId
        }
    })

    if (!gameEntity){
        throw new GameNotFoundError();
    }

    return gameEntity;
}

async function generateRandomNewsForGame(gameEntity: GameEntity, currentTick: number, assetRepository: Repository<AssetEntity>, newsGenerators: INewsGenerator[]): Promise<NewsReportEntity> {
    const assets: AssetEntity[] = await assetRepository.find({
        relations: {
            sectors: true
        }
    });

    const newsReportEntity: NewsReportEntity = selectRandomItemFromList(newsGenerators).toNewsReportEntity(currentTick, assets);
    newsReportEntity.game = gameEntity;

    return newsReportEntity;
}

async function saveNewsReport(newsReportEntity: NewsReportEntity, newsReportRepository: Repository<NewsReportEntity>) {
    await newsReportRepository.save(newsReportEntity);
}

export function generateNewsRouteFactory(newsReportRepository: Repository<NewsReportEntity>, assetRepository: Repository<AssetEntity>, gameRepository: Repository<GameEntity>, newsGenerators: INewsGenerator[]){
    return async (req: Request, res: Response) => {
        const gameIdDto: GameIdDto = req.params as unknown as GameIdDto;
        const currentTickDto: CurrentTickDto = req.body as unknown as CurrentTickDto;

        try {
            const game: GameEntity = await findGame(gameIdDto.gameId, gameRepository);
            const newsReport: NewsReportEntity = await generateRandomNewsForGame(game, currentTickDto.currentTick, assetRepository, newsGenerators);
            await saveNewsReport(newsReport, newsReportRepository);
            res.sendStatus(201);
        } catch (e) {
            if (e instanceof GameNotFoundError){
                res.sendStatus(404);
            } else {
                res.sendStatus(500);
            }
        }
    }
}