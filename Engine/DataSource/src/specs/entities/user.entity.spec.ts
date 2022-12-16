import {UserEntity} from "../../entities/user.entity";
import {DataSource} from "typeorm";
import {AppDataSource} from "../../index";

describe('User entity', () => {
    describe('Database interaction', () => {
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

        it('should create a new User in database', async () => {
            const user = new UserEntity("John", "Doe", "john.doe@live.com");

            await dataSource.getRepository(UserEntity.name).save(user);
            const users = await dataSource.getRepository(UserEntity.name).find() as UserEntity[];
            expect(users.length).toBe(1);
            expect(users[0].firstname).toBe("John");
            expect(users[0].lastname).toBe("Doe");
            expect(users[0].email).toBe("john.doe@live.com");
        });

        it('should update a new User in database', async () => {
            const user = new UserEntity("John", "Doe", "john.doe@live.com");

            await dataSource.getRepository(UserEntity.name).save(user);
            const fetchedUser: UserEntity = await dataSource.getRepository(UserEntity.name).findOneBy({
                id: user.id
            }) as UserEntity;

            fetchedUser.firstname = "Foo";
            fetchedUser.lastname = "Bar";

            await dataSource.getRepository(UserEntity.name).save(fetchedUser);
            const fetchedUserAfterUpdate: UserEntity = await dataSource.getRepository(UserEntity.name).findOneBy({
                id: user.id
            }) as UserEntity;

            expect(fetchedUserAfterUpdate.id).toEqual(user.id);
            expect(fetchedUserAfterUpdate.firstname).toEqual("Foo");
            expect(fetchedUserAfterUpdate.lastname).toEqual("Bar");
            expect(fetchedUserAfterUpdate.email).toEqual(user.email);

            // Should not modify the first instance
            expect(user.firstname).not.toEqual("Foo");
            expect(user.lastname).not.toEqual("Bar");
        });

        it('should raise error on saving if a property is missing', async () => {
            let user = new UserEntity(undefined, "Doe", "john.doe@live.com");
            await expect(dataSource.getRepository(UserEntity.name).save(user)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "firstname"
                })
            )

            user = new UserEntity("John", undefined, "john.doe@live.com");
            await expect(dataSource.getRepository(UserEntity.name).save(user)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "lastname"
                })
            )

            user = new UserEntity("John", "Doe", undefined);
            await expect(dataSource.getRepository(UserEntity.name).save(user)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "email"
                })
            )
        })

        it('should raise error on saving is email is not unique when creating a new user', async () => {
            const user1 = new UserEntity("John", "Doe", "john.doe@live.com");
            const user2 = new UserEntity("John", "Doe", "john.DOE@live.com"); // Use an email with different capitalization

            await dataSource.getRepository(UserEntity.name).save(user1);

            await expect(dataSource.getRepository(UserEntity.name).save(user2)).rejects.toContainEqual(
                expect.objectContaining({
                    "property": "email"
                })
            );
        })
    })
})