import {DataSource} from "typeorm";
import {GameEntity} from "@AppDataSource/entities/game.entity";
import {AssetEntity} from "@AppDataSource/entities/asset.entity";
import {AssetHealthEntity} from "@AppDataSource/entities/asset-health.entity";

export interface AssetOpts {
    ticker: string;
    name: string;
    description: string;
    logo: string;
}

export interface HealthOpts {
    generatedTick: number;
    assetRating: string;
    game: GameEntity;
    asset: AssetEntity;
}

export class AssetHealthFixture {
    dataSource: DataSource;

    async insertGame(): Promise<GameEntity> {
        const game = new GameEntity();
        await this.dataSource.manager.save(game);

        return game;
    }

    async insertAsset(opts?: Partial<AssetOpts>): Promise<AssetEntity> {
        const asset = new AssetEntity(opts?.ticker ?? "APPL", opts?.name ?? "Apple", opts?.description ?? "A tech company", opts?.logo ?? "logo.png")
        await this.dataSource.manager.save(asset);

        return asset;
    }

    async insertHealthData(opts?: Partial<HealthOpts>): Promise<AssetHealthEntity> {
        const assetHealthEntity = new AssetHealthEntity(opts?.generatedTick ?? 1, opts?.assetRating ?? "AA")
        assetHealthEntity.game = opts?.game ?? await this.insertGame();
        assetHealthEntity.asset = opts?.asset ?? await this.insertAsset();

        await this.dataSource.manager.save(assetHealthEntity);

        return assetHealthEntity;
    }

    async resetDB(){
        await this.dataSource.getRepository(AssetHealthEntity).delete({})
        await this.dataSource.getRepository(AssetEntity).delete({})
        await this.dataSource.getRepository(GameEntity).delete({})
    }

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }
}