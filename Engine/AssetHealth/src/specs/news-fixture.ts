import {DataSource} from "typeorm";
import {NewsReportEntity} from "../../../DataSource/src/entities/news-report.entity";
import {GameEntity} from "../../../DataSource/src/entities/game.entity";
import {AssetEntity} from "../../../DataSource/src/entities/asset.entity";
import {SectorEntity} from "../../../DataSource/src/entities/sector.entity";

export interface AssetOpts {
    ticker: string;
    name: string;
    description: string;
    logo: string;
    sectors: string[];
}

export interface NewsReportOpts {
    generatedTick: number;
    title: string;
    content: string;
    influenceFactor: number;
    game: GameEntity;
    assets: AssetEntity[];
}

export class NewsFixture {
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

    async insertNewsReport(opts?: Partial<NewsReportOpts>): Promise<NewsReportEntity> {
        const newsReport = new NewsReportEntity(opts?.generatedTick ?? 1, opts?.title ?? "A news", opts?.content ?? "Lorem ipsum", opts?.influenceFactor ?? 4)
        newsReport.game = opts?.game ?? await this.insertGame();
        newsReport.assets = opts?.assets ?? [await this.insertAsset()];

        await this.dataSource.manager.save(newsReport);

        return newsReport;
    }

    async resetDB(){
        await this.dataSource.getRepository(AssetEntity).delete({})
        await this.dataSource.getRepository(SectorEntity).delete({})
        await this.dataSource.getRepository(NewsReportEntity).delete({})
        await this.dataSource.getRepository(GameEntity).delete({})
    }

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }
}