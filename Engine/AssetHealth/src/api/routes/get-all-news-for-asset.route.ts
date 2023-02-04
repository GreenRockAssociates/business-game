import {Repository} from "typeorm";
import {NewsReportEntity} from "@AppDataSource/entities/news-report.entity";
import {Request, Response} from "express";
import {NewsReportDto, NewsResponseDto} from "../../dto/news-response.dto";
import {plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";
import {GameIdAndAssetTickerDto} from "../../dto/game-id-and-asset-ticker.dto";

async function getNewsReportEntitiesForGameAndAsset(gameId: string, assetTicket: string, newsReportRepository: Repository<NewsReportEntity>){
    return newsReportRepository.find({
        where: {
            game: {
                id: gameId
            },
            assets: {
                ticker: assetTicket
            }
        },
        relations: {
            game: true,
            assets: true
        }
    });
}

async function newsReportEntityListToResponseDto(newsReports: NewsReportEntity[]){
    const newsReportsDTOs: NewsReportDto[] = [];
    for (let report of newsReports){
        const dto = plainToInstance(NewsReportDto, report, {excludeExtraneousValues: true});
        await validateOrReject(dto);
        newsReportsDTOs.push(dto);
    }

    const responseDto = new NewsResponseDto(newsReportsDTOs);
    await validateOrReject(responseDto);

    return responseDto;
}

export function getAllNewsForAssetRouteFactory(newsReportRepository: Repository<NewsReportEntity>){
    return async (req: Request, res: Response) => {
        const gameIdAndAssetTickerDto: GameIdAndAssetTickerDto = req.params as unknown as GameIdAndAssetTickerDto;

        const newsReports: NewsReportEntity[] = await getNewsReportEntitiesForGameAndAsset(gameIdAndAssetTickerDto.gameId, gameIdAndAssetTickerDto.assetTicker, newsReportRepository);

        try {
            const responseDto: NewsResponseDto = await newsReportEntityListToResponseDto(newsReports);
            res.json(responseDto);
        } catch (e) {
            res.sendStatus(500);
        }
    }
}