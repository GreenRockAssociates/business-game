import {validateOrReject} from "class-validator";
import {GameDto} from "../../dto/game.dto";
import {GameState} from "../../entities/game.entity";

describe('Game DTO', () => {
    it('Should be valid if all fields are present as expected', async () => {
        const dto = new GameDto( "f782413a-8af2-4547-aa71-9f90eddca4e5", "A game", GameState.CREATED, "f782413a-8af2-4547-aa71-9f90eddca4e5", ["f782413a-8af2-4547-aa71-9f90eddca4e5", "f782413a-8af2-4547-aa71-9f90eddca4e5"]);

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it('Should be valid if the list of player ids is empty', async () => {
        const dto = new GameDto( "f782413a-8af2-4547-aa71-9f90eddca4e5", "A game", GameState.CREATED, "f782413a-8af2-4547-aa71-9f90eddca4e5", []);

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })
})