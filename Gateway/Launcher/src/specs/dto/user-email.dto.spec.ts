import {UserEmailDto} from "../../dto/user-email.dto";
import {validateOrReject} from "class-validator";

describe("User email DTO", () => {
    it('Should be valid if all fields are ok', async () => {
        const inviterPlayerRequest = new UserEmailDto("foo@bar.com");

        await expect(validateOrReject(inviterPlayerRequest)).resolves.toBeUndefined()
    })

    it('Should be invalid if the fields are not ok', async () => {
        const inviterPlayerRequest = new UserEmailDto("");

        await expect(validateOrReject(inviterPlayerRequest)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "userEmail"
            })
        )
    })
})