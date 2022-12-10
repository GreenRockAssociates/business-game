import {registerDecorator, ValidationOptions, ValidationArguments} from 'class-validator';
import {AppDataSource} from "../libraries/database";
import {ILike, Not} from "typeorm";

export function UniqueInColumn(primaryKey?: string, validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'uniqueInColumn',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [primaryKey],
            validator: {
                async validate(value: any, args: ValidationArguments) {
                    // Get the PK field name and value
                    const [primaryKey] = args.constraints;
                    const primaryKeyValue = (args.object as any)[primaryKey];

                    // Get the property field name and value
                    const property = args.property;
                    const propertyValue = args.value;

                    // Get the entity repository
                    const entity = args.targetName;
                    const repository = AppDataSource.getRepository(entity);

                    // Construct the where clause of the select
                    // Always search for rows that have a value in the column {property} matching (case-insensitive) the given propertyValue
                    const where = {
                        [property]: ILike(propertyValue)
                    }
                    // If a PK exists, this means the entity is being updated and not created, thus we need to exclude its own row from the select
                    if (primaryKeyValue) { where[primaryKey] = Not(primaryKeyValue) }

                    const entities = await repository.find({
                        where
                    });

                    // If there is no match, then the value of {property} is unique in the column
                    return entities.length === 0;
                }
            },
        });
    };
}
