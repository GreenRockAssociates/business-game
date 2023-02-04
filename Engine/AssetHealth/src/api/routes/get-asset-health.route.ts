import {Request, Response} from "express";
import {Repository} from "typeorm";
import {AssetHealthEntity} from "@AppDataSource/entities/asset-health.entity";
import {GameIdAndAssetTickerDto} from "../../dto/game-id-and-asset-ticker.dto";
import {plainToInstance} from "class-transformer";
import {AssetHealthResponseDto} from "../../dto/asset-health-response.dto";
import {validateOrReject} from "class-validator";

async function getLatestHealthEntityForAssetInGame(assetTicker: string, gameId: string, assetHealthRepository: Repository<AssetHealthEntity>){
    return assetHealthRepository.findOne({
        where: {
            asset: {
                ticker: assetTicker
            },
            game: {
                id: gameId
            }
        },
        // Order by generated tick descending so the first entry is the latest one
        order: {
            generatedTick: "DESC"
        },
        relations: {
            asset: true
        }
    })
}

export function getAssetHealthRouteFactory(assetHealthRepository: Repository<AssetHealthEntity>){
    return async (req: Request, res: Response) => {
        const gameIdAndAssetTickerDto: GameIdAndAssetTickerDto = req.params as unknown as GameIdAndAssetTickerDto;

        const latestAssetHealthEntity: AssetHealthEntity = await getLatestHealthEntityForAssetInGame(gameIdAndAssetTickerDto.assetTicker, gameIdAndAssetTickerDto.gameId, assetHealthRepository)
        if (!latestAssetHealthEntity){
            res.sendStatus(404);
            return;
        }

        const responseDto = plainToInstance(AssetHealthResponseDto, latestAssetHealthEntity, {excludeExtraneousValues: true});
        try {
            await validateOrReject(responseDto);
            res.json(responseDto);
        } catch (e) {
            res.sendStatus(500);
        }
    }
}