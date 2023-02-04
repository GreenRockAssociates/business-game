import {Repository} from "typeorm";
import {NewsReportEntity} from "../../../../DataSource/src/entities/news-report.entity";
import {Request, Response} from "express";
import {GameIdDto} from "../../dto/game-id.dto";
import {NewsReportDto, NewsResponseDto} from "../../dto/news-response.dto";
import {plainToInstance} from "class-transformer";
import {validateOrReject} from "class-validator";

async function getNewsReportEntitiesForGame(gameId: string, newsReportRepository: Repository<NewsReportEntity>){
    return newsReportRepository.find({
        where: {
            game: {
                id: gameId
            }
        },
        relations: {
            game: true
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

export function getAllNewsRouteFactory(newsReportRepository: Repository<NewsReportEntity>){
    return async (req: Request, res: Response) => {
        const gameIdDto: GameIdDto = req.params as unknown as GameIdDto;

        const newsReports: NewsReportEntity[] = await getNewsReportEntitiesForGame(gameIdDto.gameId, newsReportRepository);

        try {
            const responseDto: NewsResponseDto = await newsReportEntityListToResponseDto(newsReports);
            res.json(responseDto);
        } catch (e) {
            res.sendStatus(500);
        }
    }
}