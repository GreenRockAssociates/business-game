import {validateOrReject} from "class-validator";
import {SessionDataResponseDto} from "../../dto/session-data-response.dto";

describe('Session Data Response DTO', () => {
    it('Should be valid if all fields are present as expected', async () => {
        const dto = new SessionDataResponseDto( "f782413a-8af2-4547-aa71-9f90eddca4e5");

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it('Should not be valid if userId is missing', async () => {
        const dto = new SessionDataResponseDto(undefined);

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "userId"
            })
        )
    })

    it('Should not be valid if userId is empty', async () => {
        const dto = new SessionDataResponseDto("");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "userId"
            })
        )
    })

    it('Should not be valid if userId is not a valid uuid', async () => {
        const dto = new SessionDataResponseDto("not a uuid");

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "userId"
            })
        )
    })
})