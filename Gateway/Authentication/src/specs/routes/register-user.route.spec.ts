import {DataSource} from "typeorm";
import {UserEntity} from "../../entities/user.entity";
import {AppDataSource} from "../../libraries/database";
import {registerUser} from "../../api/routes/register.route";
import {Request, Response} from "express";
import {RegisterUserDto} from "../../dto/register-user.dto";

describe("Register route", () => {
    let dataSource: DataSource;
    const response = {
        statusMessage: "",
        sendStatus() {}
    };
    let responseSpy: jest.SpyInstance;
    let saveSpy: jest.SpyInstance;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });

        responseSpy = jest.spyOn(response, 'sendStatus');
        saveSpy = jest.spyOn(dataSource.getRepository(UserEntity.name), "save");
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    afterEach(async () => {
        response.statusMessage = "";
        await dataSource.getRepository(UserEntity.name).clear();
        jest.clearAllMocks();
    })

    it('Should save the user to the database if the payload is correct', async () => {
        const user = new RegisterUserDto("Foo", "Bar", "foo@bar.com", "aaaaaaaaaaaaaaaaaaaaaa");
        const repository = dataSource.getRepository<UserEntity>(UserEntity.name);

        await registerUser({body: user} as Request, response as unknown as Response, repository);

        // Check calls to DB
        expect(responseSpy).toHaveBeenCalledWith(200);
        expect(saveSpy).toHaveBeenCalled();

        // Check actual DB for values
        const users = await repository.find() as UserEntity[];
        expect(users.length).toBe(1);
        expect(users[0].firstname).toBe("Foo");
        expect(users[0].lastname).toBe("Bar");
        expect(users[0].email).toBe("foo@bar.com");
    })

    it('Should be able to add a new user if a different one exists', async () => {
        const user = new RegisterUserDto("Foo", "Bar", "foo@bar.com", "aaaaaaaaaaaaaaaaaaaaaa");
        const repository = dataSource.getRepository<UserEntity>(UserEntity.name);

        // Setup the DB so a user with a different email exists
        const previousUser = new UserEntity(
            "Jane",
            "Doe",
            "jane@doe.com"
        );
        await previousUser.setPassword("aaaaaaaaaaaaaaaaaaaaaaaaaa");
        await repository.save(previousUser);
        saveSpy.mockClear();

        // Register the user
        await registerUser({body: user} as Request, response as unknown as Response, repository);

        // Check calls to DB
        expect(responseSpy).toHaveBeenCalledWith(200);
        expect(saveSpy).toHaveBeenCalled();

        // Check actual DB for values
        const users = await repository.find() as UserEntity[];
        expect(users.length).toBe(2);
        expect(users.map(value => value.firstname)).toContain("Foo");
        expect(users.map(value => value.lastname)).toContain("Bar");
        expect(users.map(value => value.email)).toContain("foo@bar.com");
    })

    it('Should not save the user to the database if a user with the same email already exists', async () => {
        const userDto = new RegisterUserDto("Foo", "Bar", "foo@bar.com", "aaaaaaaaaaaaaaaaaaaaaa");
        const repository = dataSource.getRepository<UserEntity>(UserEntity.name);

        // Setup the DB so a user with this email already exists
        const previousUser = new UserEntity(
            userDto.firstName,
            userDto.lastName,
            "FoO@bAr.com" // Random case for worst case scenario
        );
        await previousUser.setPassword(userDto.password);
        await repository.save(previousUser);
        saveSpy.mockClear();

        // Try to register the user
        await registerUser({body: userDto} as Request, response as unknown as Response, repository);

        // Check calls to DB
        expect(responseSpy).toHaveBeenCalledWith(401);
        expect(saveSpy).toHaveBeenCalled();

        // Check that there is indeed only one entry in the database
        const users = await repository.find() as UserEntity[];
        expect(users.length).toBe(1);
    })
})