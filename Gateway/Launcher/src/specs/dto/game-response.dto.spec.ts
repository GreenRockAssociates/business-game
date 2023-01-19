import {validateOrReject} from "class-validator";
import {GameResponseDto} from "../../dto/game-response.dto";
import {GameState} from "../../entities/game.entity";
import {InvitationResponseDto} from "../../dto/invitation-response.dto";

describe('Game DTO', () => {
    it('Should be valid if all fields are present as expected', async () => {
        const invitations = [
            new InvitationResponseDto("5a48eff0-860b-40d6-942d-858848957843", "9d9beb2d-44f5-4d91-a8ec-13a0909cda17", true),
            new InvitationResponseDto("5a48eff0-860b-40d6-942d-858848957843", "9d9beb2d-44f5-4d91-a8ec-13a0909cda17", true)
        ]
        const dto = new GameResponseDto( "f782413a-8af2-4547-aa71-9f90eddca4e5", "A game", GameState.CREATED, "f782413a-8af2-4547-aa71-9f90eddca4e5", invitations);

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it('Should be valid if the list of invitations is empty', async () => {
        const dto = new GameResponseDto( "f782413a-8af2-4547-aa71-9f90eddca4e5", "A game", GameState.CREATED, "f782413a-8af2-4547-aa71-9f90eddca4e5", []);

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })
})