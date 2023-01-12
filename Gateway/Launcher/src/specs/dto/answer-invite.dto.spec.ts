import {validateOrReject} from "class-validator";
import {AnswerInviteDto} from "../../dto/answer-invite.dto";

describe("Answer invite DTO", () => {
    it("Should be valid ok all fields are ok", async () => {
        const dto = new AnswerInviteDto("64f5eb66-2896-4d98-ab45-ed05ee54aedd", true)

        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it("Should be invalid if the gameId is not a UUID", async () => {
        const dto = new AnswerInviteDto("notauuid", true)

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "gameId"
            })
        )
    })

    it("Should be invalid if the gameId is not a string", async () => {
        const dto = new AnswerInviteDto(undefined, true)

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "gameId"
            })
        )
    })

    it("Should be invalid if 'accept' is not a boolean", async () => {
        const dto = new AnswerInviteDto("64f5eb66-2896-4d98-ab45-ed05ee54aedd", undefined)

        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "accept"
            })
        )
    })
})