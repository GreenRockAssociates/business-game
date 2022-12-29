import {GetGameDetailRequestDto} from "../../dto/get-game-detail-request.dto";
import {validateOrReject} from "class-validator";

describe("Get game detail request DTO", () => {
    it("Should be valid ok all fields are ok", async () => {
        const dto = new GetGameDetailRequestDto("64f5eb66-2896-4d98-ab45-ed05ee54aedd")

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it("Should be invalid if the gameId is not a UUID", async () => {
        const dto = new GetGameDetailRequestDto("notauuid")

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "gameId"
            })
        )
    })

    it("Should be invalid if the gameId is not a string", async () => {
        const dto = new GetGameDetailRequestDto(undefined)

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "gameId"
            })
        )
    })
})