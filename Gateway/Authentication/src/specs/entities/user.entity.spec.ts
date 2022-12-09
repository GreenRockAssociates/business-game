import {AppDataSource} from "../../libraries/database";
import {UserEntity} from "../../entities/user.entity";
import {DataSource} from "typeorm";
import * as bcrypt from "bcrypt";

describe('User entity', () => {
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        await dataSource.getRepository(UserEntity.name).clear()
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        await dataSource.getRepository(UserEntity.name).clear()
    })

    describe('Validations', () => {
        it('should create a new User in database', async () => {
            const user = new UserEntity("John", "Doe", "john.doe@live.com");
            await user.setPassword("password");

            await dataSource.getRepository(UserEntity.name).save(user);
            const users = await dataSource.getRepository(UserEntity.name).find();
            expect(users.length).toBe(1);
            expect(users[0].firstname).toBe("John");
            expect(users[0].lastname).toBe("Doe");
            expect(users[0].email).toBe("john.doe@live.com");

            // We don't want to expose the password hash
            expect(users[0].passwordHash).toBeUndefined();
        });

        it('should raise error if a property is missing', async () => {
            let user = new UserEntity(undefined, "Doe", "john.doe@live.com");
            await user.setPassword("password");
            await expect(dataSource.getRepository(UserEntity.name).save(user)).rejects.toThrow();

            user = new UserEntity("John", undefined, "john.doe@live.com");
            await user.setPassword("password");
            await expect(dataSource.getRepository(UserEntity.name).save(user)).rejects.toThrow();

            user = new UserEntity("John", "Doe", undefined);
            await user.setPassword("password");
            await expect(dataSource.getRepository(UserEntity.name).save(user)).rejects.toThrow();

            user = new UserEntity("John", "Doe", "john.doe@live.com");
            await expect(dataSource.getRepository(UserEntity.name).save(user)).rejects.toThrow();
        })
    })

    test('The password should be hashed', async () => {
        let user = new UserEntity(undefined, "Doe", "john.doe@live.com");
        await user.setPassword("password");

        await expect(bcrypt.compare("password", user.passwordHash)).resolves.toBeTruthy()
    })

    test('isPasswordValid() should return true when the given password is correct', async () => {
        let user = new UserEntity(undefined, "Doe", "john.doe@live.com");
        await user.setPassword("password");

        await expect(user.isPasswordValid("password")).resolves.toBeTruthy()
    })

    test('isPasswordValid() should return false when the given password is incorrect', async () => {
        let user = new UserEntity(undefined, "Doe", "john.doe@live.com");
        await user.setPassword("password");

        await expect(user.isPasswordValid("wrong-password")).resolves.toBeFalsy()
    })
})