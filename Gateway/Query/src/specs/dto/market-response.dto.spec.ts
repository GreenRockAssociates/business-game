import {MarketEntryDto, MarketResponseDto} from "../../dto/market-response.dto";
import {validateOrReject} from "class-validator";

describe("Market response dto", () => {
    describe("Market entry dto", () => {
        it("Should be invalid if the ticker is invalid", async () => {
            const dto = new MarketEntryDto("APPLLLLLL", 10, 100, true);
            await expect(validateOrReject(dto)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "assetId"
                })
            )
        })

        it("Should be invalid of the tick is negative", async () => {
            const dto = new MarketEntryDto("APPL", -1, 100, true);
            await expect(validateOrReject(dto)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "tick"
                })
            )
        })

        it("Should be invalid of the value is negative", async () => {
            const dto = new MarketEntryDto("APPL", 10, -100, true);
            await expect(validateOrReject(dto)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "value"
                })
            )
        })
    })

    it("Should be valid if empty", async () => {
        const dto = new MarketResponseDto([]);
        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it("Should be valid if contains correct values", async () => {
        const dto = new MarketResponseDto([new MarketEntryDto("APPL", 10, 100, true), new MarketEntryDto("MSFT", 10, 100, true)]);
        await expect(validateOrReject(dto)).resolves.toBeUndefined()
    })

    it("Should be invalid if contains incorrect values", async () => {
        let dto = new MarketResponseDto([new MarketEntryDto("APPLLLLLL", 10, 100, true)]);
        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "market"
            })
        )

        dto = new MarketResponseDto([new MarketEntryDto("APPL", -1, 100, true)]);
        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "market"
            })
        )

        dto = new MarketResponseDto([new MarketEntryDto("APPL", 10, -100, true)]);
        await expect(validateOrReject(dto)).rejects.toContainEqual(
            expect.objectContaining({
                "property": "market"
            })
        )
    })
})