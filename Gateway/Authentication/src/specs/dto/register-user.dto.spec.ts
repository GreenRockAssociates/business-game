import {RegisterUserDto} from "../../dto/register-user.dto";
import {validateOrReject} from "class-validator";

describe('Register user DTO', () => {
    it('Should be valid if all fields are working as expected', async () => {
        const dto = new RegisterUserDto("Foo", "Bar", "foo@bar.com", "azertyuiopqsdfghjklm");

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it('Should not be valid if firstName is missing', async () => {
        const dto = new RegisterUserDto(undefined, "Bar", "foo@bar.com", "azertyuiopqsdfghjklm");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "firstName"
            })
        )
    })

    it('Should not be valid if lastName is missing', async () => {
        const dto = new RegisterUserDto("Foo", undefined, "foo@bar.com", "azertyuiopqsdfghjklm");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "lastName"
            })
        )
    })

    it('Should not be valid if email is missing', async () => {
        const dto = new RegisterUserDto("Foo", "Bar", undefined, "azertyuiopqsdfghjklm");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "email"
            })
        )
    })

    it('Should not be valid if email is not an email', async () => {
        const dto = new RegisterUserDto("Foo", "Bar", "aaaaa", "azertyuiopqsdfghjklm");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "email"
            })
        )
    })

    it('Should not be valid if password is missing', async () => {
        const dto = new RegisterUserDto("Foo", "Bar", "foo@bar.com", undefined);

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "password"
            })
        )
    })

    it('Should not be valid if password is less than 12 characters', async () => {
        const dto = new RegisterUserDto("Foo", "Bar", "foo@bar.com", "azertyuiopq");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "password"
            })
        )
    })
})