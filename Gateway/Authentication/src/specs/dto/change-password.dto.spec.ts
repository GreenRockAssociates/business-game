import {validateOrReject} from "class-validator";
import {ChangePasswordDto} from "../../dto/change-password.dto";

describe('Register user DTO', () => {
    it('Should be valid if all fields are filled as expected', async () => {
        const dto = new ChangePasswordDto("azertyuiopqsdfghjklm", "passwordpassword");

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it('Should be invalid old password is undefined', async () => {
        const dto = new ChangePasswordDto(undefined, "passwordpassword");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "oldPassword"
            })
        )
    })

    it('Should be invalid old password is less than 12 characters', async () => {
        const dto = new ChangePasswordDto("0123456789!", "passwordpassword");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "oldPassword"
            })
        )
    })

    it('Should be invalid new password is undefined', async () => {
        const dto = new ChangePasswordDto("azertyuiopqsdfghjklm", undefined);

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "newPassword"
            })
        )
    })

    it('Should be invalid new password is less than 12 characters', async () => {
        const dto = new ChangePasswordDto("azertyuiopqsdfghjklm", "0123456789!");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "newPassword"
            })
        )
    })
})