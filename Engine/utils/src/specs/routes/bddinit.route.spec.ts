import {DataSource} from "typeorm";
import {AppDataSource} from "../../../../DataSource/src/index";
import {Request, response, Response} from "express";

import {PlayerEntity} from "../../../../DataSource/src/entities/player.entity";
import {MarketEntity} from "../../../../DataSource/src/entities/market.entity";
import {PortfolioEntity} from "../../../../DataSource/src/entities/portfolio.entity";
import {SectorEntity} from "../../../../DataSource/src/entities/sector.entity";
import {AssetEntity} from "../../../../DataSource/src/entities/asset.entity";
import {GameEntity} from "../../../../DataSource/src/entities/game.entity";
import {migrate} from "../../ini/bdd_ini";
class ResponseMock {
    sendStatus() {}
}


describe("bdd init", () => {
    let responseMock: ResponseMock
    let sendStatusSpy: jest.SpyInstance;

    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        responseMock = new ResponseMock()

        sendStatusSpy = jest.spyOn(responseMock, 'sendStatus');
    })

    afterEach(async () => {
        await dataSource.getRepository(PortfolioEntity).delete({});
        await dataSource.getRepository(PlayerEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
        await dataSource.getRepository(MarketEntity).delete({});
    })

    it("bdd init",async ()=> {

        await migrate({} as unknown as Request, responseMock as unknown as Response, dataSource.getRepository(SectorEntity), dataSource.getRepository(AssetEntity));

        expect(sendStatusSpy).toHaveBeenCalledWith(200);
        const assetdb = await dataSource.getRepository(AssetEntity).find({

            relations : {
                sectors : true
            }


        })

    })


})