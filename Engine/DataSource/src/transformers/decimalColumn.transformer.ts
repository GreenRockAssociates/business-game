/**
 * Use to preserve the number type when manipulating a Decimal column in the database
 *
 * Code from : https://github.com/typeorm/typeorm/issues/873#issuecomment-424643086
 */
export class DecimalColumnTransformer {
    to(data: number): number {
        return data;
    }
    from(data: string): number {
        return parseFloat(data);
    }
}