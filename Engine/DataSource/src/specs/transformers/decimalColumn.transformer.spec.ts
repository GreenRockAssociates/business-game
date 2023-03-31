import {DecimalColumnTransformer} from "../../transformers/decimalColumn.transformer";

describe("Decimal Column Transformer", () => {
    const transformer = new DecimalColumnTransformer()

    it('Should preserve the number type when saving', () => {
        expect(typeof transformer.to(0)).toEqual(typeof 0)
    })

    it('Should convert string to number when reading', () => {
        expect(typeof transformer.from('0')).toEqual(typeof 0)
        expect(transformer.from('0.00')).toEqual(0)
    })
})