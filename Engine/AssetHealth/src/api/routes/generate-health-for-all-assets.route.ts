import {Repository} from "typeorm";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {AssetHealthEntity} from "../../../../DataSource/src/entities/asset-health.entity";
import {Request, Response} from "express";
import {GameIdDto} from "../../dto/game-id.dto";
import {CurrentTickDto} from "../../dto/current-tick.dto";
import {COMPANY_RATING_VALUES} from "../../constants/health.constants";

class InvalidTickValue{}

async function getGameFromId(gameId: string, gameRepository: Repository<GameEntity>) {
    return gameRepository.findOneBy({
        id: gameId
    })
}

async function getAllAssets(assetRepository: Repository<AssetEntity>): Promise<AssetEntity[]> {
    return assetRepository.find();
}

function shiftNote(assetRating: string) {
    let noteIndex = COMPANY_RATING_VALUES.indexOf(assetRating);
    const p = Math.random();
    if (p < 0.1) { // 10% to increase the note by 2 levels
        noteIndex -= 2
    } else if (p < 0.3) { // 20% to increase the note by 1 level
        noteIndex -= 1
    } else if (p < 0.7) { // 40% to do nothing
        return assetRating;
    } else if (p < 0.9) { // 20% to decrease the note by 1 level
        noteIndex += 1
    } else { // 10% to decrease the note by 2 levels
        noteIndex += 2
    }
    // Bound the note
    noteIndex = Math.min(noteIndex, COMPANY_RATING_VALUES.length);
    noteIndex = Math.max(0, noteIndex);
    // Get the new note string
    return COMPANY_RATING_VALUES[noteIndex];
}

async function generateNewHealthValue(asset: AssetEntity, game: GameEntity, healthRepository: Repository<AssetHealthEntity>, currentTick: number): Promise<void> {
    const previousHealth: AssetHealthEntity | null = await healthRepository.findOne({
        where: {
            asset: asset,
            game: game
        },
        order: {
            generatedTick: "DESC"
        }
    }) as AssetHealthEntity | null;

    if ((previousHealth?.generatedTick ?? 0) > currentTick) {
        throw new InvalidTickValue();
    }

    // If there exists a note, use it, otherwise use the average value and move it a bit
    const newNote: string = shiftNote(previousHealth?.assetRating ?? COMPANY_RATING_VALUES[COMPANY_RATING_VALUES.length / 2]);

    const newHealth = new AssetHealthEntity(currentTick, newNote);
    newHealth.asset = asset;
    newHealth.game = game;

    await healthRepository.save(newHealth);
}

export function generateNewHealthForAllAssetsRouteFactory(gameRepository: Repository<GameEntity>, assetRepository: Repository<AssetEntity>, healthRepository: Repository<AssetHealthEntity>){
    return async (req: Request, res: Response) => {
        const gameIdDto: GameIdDto = req.params as unknown as GameIdDto;
        const currentTickDto: CurrentTickDto = req.body as unknown as CurrentTickDto;

        const game: GameEntity = await getGameFromId(gameIdDto.gameId, gameRepository);
        if (!game){
            res.sendStatus(404);
            return;
        }

        const assets: AssetEntity[] = await getAllAssets(assetRepository);

        try {
            // Insert all new values in parallel
            await Promise.all(assets.map(asset => generateNewHealthValue(asset, game, healthRepository, currentTickDto.currentTick)));

            res.sendStatus(200);
        } catch (e) {
            if (e instanceof InvalidTickValue){
                res.sendStatus(400);
            } else {
                res.sendStatus(500);
            }
        }
    }
}