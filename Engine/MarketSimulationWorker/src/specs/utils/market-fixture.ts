import { DataSource } from "typeorm";
import { AssetEntity } from "../../../../DataSource/src/entities/asset.entity";
import { GameEntity } from "../../../../DataSource/src/entities/game.entity";
import { MarketEntity } from "../../../../DataSource/src/entities/market.entity";
import { SectorEntity } from "../../../../DataSource/src/entities/sector.entity";

export interface AssetOpts {
    ticker: string;
    name: string;
    description: string;
    logo: string;
    sectors: string[];
}

export interface MarketOpts {
    tick: number;
    value: number;
    tradable: boolean
    game: GameEntity;
    asset: AssetEntity;
}

export class MarketFixture {
    dataSource: DataSource;

    async insertGame(): Promise<GameEntity> {
        const game = new GameEntity();
        await this.dataSource.manager.save(game);

        return game;
    }

    async insertAsset(opts?: Partial<AssetOpts>): Promise<AssetEntity> {
        const asset = new AssetEntity(opts?.ticker ?? "APPL", opts?.name ?? "Apple", opts?.description ?? "A tech company", opts?.logo ?? "logo.png")
        if (opts?.sectors){
            asset.sectors = [];
            opts?.sectors?.forEach(sector => {
                asset.sectors.push(new SectorEntity(sector));
            })
        }
        await this.dataSource.manager.save(asset);

        return asset;
    }

    async insertMarket(opts?: Partial<MarketOpts>): Promise<MarketEntity> {
        const marketEntity = new MarketEntity(opts?.tick ?? 1, opts?.value ?? 10, opts?.tradable ?? true);
        marketEntity.game = opts?.game ?? await this.insertGame();
        marketEntity.asset = opts?.asset ?? await this.insertAsset();
        await this.dataSource.manager.save(marketEntity);

        return marketEntity;
    }

    async resetDB(){
        await this.dataSource.getRepository(MarketEntity).delete({})
        await this.dataSource.getRepository(SectorEntity).delete({})
        await this.dataSource.getRepository(AssetEntity).delete({})
        await this.dataSource.getRepository(GameEntity).delete({})
    }

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }
}