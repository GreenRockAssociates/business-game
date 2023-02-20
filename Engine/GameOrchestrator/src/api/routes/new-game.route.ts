import {Request, Response} from 'express';
import {Repository} from "typeorm";
import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {NewGameDto} from "../../dto/new-game.dto";
import {newgameResponseDto} from "../../dto/new-game-reponse.dto";
import {RabbitMqInteractor} from "../../message-broker/rabbit-mq-interactor";
import {AssetHealthService} from "../../libraries/asset-health.service";
import {AddGameOutgoingMessageDto} from "../../dto/add-game-outgoing-message.dto";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {STARTING_ASSET_PRICE_BUCKETS, STARTING_BANK_ACCOUNT} from "../../constants/game-initialization.constants";

async function getAllAssets(repositoryAsset: Repository<AssetEntity>): Promise<AssetEntity[]> {
    return repositoryAsset.find();
}

async function generateStartingMarket(game: GameEntity, repositoryMarket: Repository<MarketEntity>, repositoryAsset: Repository<AssetEntity>){
    const assets: AssetEntity[] = await getAllAssets(repositoryAsset);

    const startingMarket: MarketEntity[] = [];
    assets.forEach(asset => {
        const [minPrice, maxPrice] = STARTING_ASSET_PRICE_BUCKETS[Math.floor(Math.random() * STARTING_ASSET_PRICE_BUCKETS.length)];
        const startingPrice = minPrice + (Math.round(Math.random() * (maxPrice - minPrice) * 100) / 100) // Generate a random value between minPrice and maxPrice, keeping two decimal places

        const newMarketEntity: MarketEntity = new MarketEntity(1, startingPrice, true);
        newMarketEntity.game = game;
        newMarketEntity.asset = asset;

        startingMarket.push(newMarketEntity);
    })

    await Promise.all(startingMarket.map(marketEntity => repositoryMarket.save(marketEntity)));
}

export async function newGame(req: Request, res: Response, repositoryPlayer : Repository<PlayerEntity>, repositoryGame : Repository<GameEntity>, repositoryMarket: Repository<MarketEntity>, repositoryAsset: Repository<AssetEntity>, rabbitMqInteractor: RabbitMqInteractor, assetHealthService: AssetHealthService) {
    const dto = req.body as NewGameDto;

    const newGameEntity: GameEntity = new GameEntity();
    await repositoryGame.save(newGameEntity);

    // Create the players
    let playerEntities: PlayerEntity[] = [];
    for(let i = 0; i < dto.numberOfPlayers; i++){
        const newPlayerEntity: PlayerEntity = new PlayerEntity(STARTING_BANK_ACCOUNT);
        newPlayerEntity.game = newGameEntity;
        playerEntities.push(newPlayerEntity);
    }

    // Run all async steps in parallel to speed up processing
    await Promise.all([
        ...playerEntities.map(playerEntity => repositoryPlayer.save(playerEntity)),
        generateStartingMarket(newGameEntity, repositoryMarket, repositoryAsset),
        assetHealthService.generateNewHealthDataForGame(newGameEntity.id, 1),
    ])

    // Only start the game simulation once every step is complete
    await rabbitMqInteractor.sendToGameStartQueue(new AddGameOutgoingMessageDto(newGameEntity.id));

    const responseDto = new newgameResponseDto(newGameEntity.id, playerEntities.map(playerEntity => playerEntity.id));
    res.json(responseDto);
}