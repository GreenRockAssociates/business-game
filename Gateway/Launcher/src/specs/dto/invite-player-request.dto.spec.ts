import {InvitePlayerRequestDto} from "../../dto/invite-player-request.dto";
import {validateOrReject} from "class-validator";

describe("Invite player request DTO", () => {
    it('Should be valid if all fields are ok', async () => {
        const inviterPlayerRequest = new InvitePlayerRequestDto("foo@bar.com");

        await expect(validateOrReject(inviterPlayerRequest)).resolves.toBeUndefined()
    })

    it('Should be invalid if the fields are not ok', async () => {
        const inviterPlayerRequest = new InvitePlayerRequestDto("");

        await expect(validateOrReject(inviterPlayerRequest)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "playerEmail"
            })
        )
    })
})