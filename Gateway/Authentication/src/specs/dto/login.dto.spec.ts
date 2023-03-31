import {validateOrReject} from "class-validator";
import {LoginDto} from "../../dto/login.dto";
import {sanitize} from "class-sanitizer";

describe('Login DTO', () => {
    it('Should be valid if all fields are working as expected', async () => {
        const dto = new LoginDto( "foo@bar.com", "azertyuiopqsdfghjklm");

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it('Should not be valid if email is missing', async () => {
        const dto = new LoginDto(undefined, "azertyuiopqsdfghjklm");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "email"
            })
        )
    })

    it('Should not be valid if email is not an email', async () => {
        const dto = new LoginDto("aaaaa", "azertyuiopqsdfghjklm");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "email"
            })
        )
    })

    it('Should not be valid if password is missing', async () => {
        const dto = new LoginDto("foo@bar.com", undefined);

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "password"
            })
        )
    })

    it('Should sanitize the email to be lowercase', async () => {
        const dto = new LoginDto( "fOo@bAR.com", "azertyuiopqsdfghjklm");

        sanitize(dto);

        expect(dto.email).toEqual("foo@bar.com")
        expect(dto.password).toEqual("azertyuiopqsdfghjklm")
    })
})