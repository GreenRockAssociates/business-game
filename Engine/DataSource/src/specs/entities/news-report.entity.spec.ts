import {AppDataSource} from "../../index";
import {DataSource} from "typeorm";
import {NewsReportEntity} from "../../entities/news-report.entity";
import {AssetEntity} from "../../entities/asset.entity";

describe("News report entity", () => {
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
        await dataSource.getRepository(AssetEntity.name).delete({})
        await dataSource.getRepository(NewsReportEntity.name).delete({})
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
        await dataSource.getRepository(AssetEntity.name).delete({})
        await dataSource.getRepository(NewsReportEntity.name).delete({})
    })

    it("Should create", async () => {
        const asset = new AssetEntity("AAPL", "Apple", "A tech company", "logo.png")
        await dataSource.manager.save(asset);
        const asset2 = new AssetEntity("MSFT", "Microsoft", "A tech company", "logo.png")
        await dataSource.manager.save(asset2);

        const news = new NewsReportEntity(10, "Mass layoffs in tech sector", "Many companies freeze hiring in response to downturns in the stock market", -2)
        news.assets = [asset, asset2];
        await dataSource.manager.save(news);

        const newsFromDb = await dataSource.getRepository(NewsReportEntity).findOne({
            where: {
                id: news.id
            },
            relations: {
                assets: true
            }
        })
        const assetsFromDb = await dataSource.getRepository(AssetEntity).find({
            relations: {
                newsReportEntries: true
            }
        })
        expect(newsFromDb).not.toBeNull();
        expect(newsFromDb.assets.length).toEqual(2);
        expect(assetsFromDb.length).toEqual(2);
        expect(assetsFromDb[0].newsReportEntries.length).toEqual(1);
        expect(assetsFromDb[1].newsReportEntries.length).toEqual(1);
    })
})