import {MarketSimulationIncomingMessageDTO} from "../../dto/market-simulation-incoming-message.dto";
import {RabbitMqInteractor} from "../rabbit-mq-interactor";
import {NormalDistribution} from "../../libraries/normal-distribution";
import {DataSource} from "typeorm";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity"
import { MarketEntity } from "../../../../DataSource/src/entities/market.entity";
import { GameEntity } from "../../../../DataSource/src/entities/game.entity";
import {MarketStateOutgoingMessageDto} from "../../dto/market-state-outgoing-message.dto";

function generatePriceVariation(price: number): number {
    return NormalDistribution.generate(0.5, 0.15) * price / 120;
}

/**
 * This method returns `value` truncated to keep only the first `decimalsToKeep` decimal places
 * @param value
 * @param decimalsToKeep
 */
function truncateNumber(value: number, decimalsToKeep: number) {
    let multiplier = Math.pow(10, decimalsToKeep || 0);
    return Math.floor(value * multiplier) / multiplier;
}

function applyRandomStep(currentMarketState: Map<string, number>, evolutionVector: Map<string, number>): Map<string, number> {
    const newMarketState: Map<string, number> = new Map<string, number>();
    currentMarketState.forEach((marketValue, asset) => {
        const variation = generatePriceVariation(marketValue);

        let newPrice = marketValue;
        if (Math.random() < evolutionVector.get(asset)){
            newPrice += variation;
        } else {
            newPrice -= variation;
        }

        newPrice = truncateNumber(newPrice, 2);

        newMarketState.set(asset, newPrice);
    })
    return newMarketState;
}

async function saveNewMarketState(newMarketState: Map<string, number>, dataSource: DataSource, gameId: string, tick: number){
    const gameEntity: GameEntity = await dataSource.getRepository(GameEntity).findOneBy({
        id: gameId
    })
    const assetRepository = dataSource.getRepository(AssetEntity);
    const marketRepository = dataSource.getRepository(MarketEntity);
    await Promise.all(Array.from(newMarketState).map(async ([assetTicker, newMarketValue]) => {
        const assetEntity: AssetEntity = await assetRepository.findOneBy({
            ticker: assetTicker
        })

        const newMarketState: MarketEntity = new MarketEntity(tick, newMarketValue, true);
        newMarketState.asset = assetEntity;
        newMarketState.game = gameEntity;

        await marketRepository.save(newMarketState);
    }))
}

export function generateNewMarketStateListenerFactory(rabbitMqInteractor: RabbitMqInteractor, dataSource: DataSource){
    return async (message: MarketSimulationIncomingMessageDTO) => {
        const tick = message.tick;
        const gameId = message.gameId;
        const marketState: Map<string, number> = message.getMarketState();
        const evolutionVector: Map<string, number> = message.getEvolutionVector();

        const newMarketState = applyRandomStep(marketState, evolutionVector);

        await saveNewMarketState(newMarketState, dataSource, gameId, tick);

        await rabbitMqInteractor.sendToMarketStateExchange(new MarketStateOutgoingMessageDto(gameId, tick, [...newMarketState]));
    }
}