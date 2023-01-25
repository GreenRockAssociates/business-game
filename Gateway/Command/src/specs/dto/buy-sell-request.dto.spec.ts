import {BuySellInternalRequestDto} from "../../dto/buy-sell-internal-request.dto";
import {validateOrReject} from "class-validator";

describe("Buy and sell request dto", () => {
    it("Should correctly identify tickers", async () => {
        const validTickers = ["APPL", "MSFT", "AZERT"]
        const invalidTickers = ["appl", "mSfT", "a", "az", "aze", "azerty"]

        for (let ticker of validTickers){
            const dto = new BuySellInternalRequestDto("082629ac-cea9-4daf-9937-556aad5757c6", ticker, 10);
            await expect(validateOrReject(dto)).resolves.toBeUndefined();
        }

        for (let ticker of invalidTickers){
            const dto = new BuySellInternalRequestDto("082629ac-cea9-4daf-9937-556aad5757c6", ticker, 10);
            await expect(validateOrReject(dto)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "assetId"
                })
            )
        }
    })
})