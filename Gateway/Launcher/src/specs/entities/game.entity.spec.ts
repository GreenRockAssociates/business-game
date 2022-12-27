import {DataSource} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {GameEntity, GameState} from "../../entities/game.entity";

describe("Game entity", () => {
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
        await dataSource.getRepository(GameEntity.name).delete({})
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        // Use .delete({}) and not .clear() since there are foreign keys : https://github.com/typeorm/typeorm/issues/2978#issuecomment-730596460
        await dataSource.getRepository(GameEntity.name).delete({})
    })

    it("Should be able to create a new game", async () => {
        const game = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", "f4c5b4d9-94a7-4841-8546-25bf0b044e02")

        await dataSource.manager.save(game)

        const result = await dataSource.getRepository(GameEntity).find();

        expect(result.length).toEqual(1)
        const gameFromDb = result[0]
        expect(gameFromDb.id).toEqual(game.id);
        expect(gameFromDb.engineId).toEqual(game.engineId);
        expect(gameFromDb.ownerId).toEqual(game.ownerId);
        expect(gameFromDb.gameState).toEqual(GameState.CREATED);
    })

    it("Should refuse insertion if ownedId field is missing", async () => {
        let game = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", "")

        await expect(dataSource.getRepository(GameEntity).save(game)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "ownerId"
            })
        )

        game = new GameEntity("a0911cdb-fd25-4899-9596-60ef5a112916", undefined)

        await expect(dataSource.getRepository(GameEntity).save(game)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "ownerId"
            })
        )
    })

    it("Should allow a null engineId", async () => {
        let game = new GameEntity(undefined, "a0911cdb-fd25-4899-9596-60ef5a112916")

        await expect(dataSource.getRepository(GameEntity).save(game)).resolves.not.toBeUndefined()
    })

    it("Should refuse an empty string for engineId", async () => {
        let game = new GameEntity("","a0911cdb-fd25-4899-9596-60ef5a112916")

        await expect(dataSource.getRepository(GameEntity).save(game)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "engineId"
            })
        )
    })
})