import {UserEntity} from "../../entities/user.entity";
import {DataSource, Repository} from "typeorm";
import {AppDataSource} from "../../libraries/database";
import {Request, Response} from "express";
import {LoginDto} from "../../dto/login.dto";
import {login} from "../../api/routes/login.route";
import {UserSessionData} from "../../interfaces/session-data.interface";


describe("Login route", () => {
    let dataSource: DataSource;
    let repository: Repository<UserEntity>
    let user: UserEntity;

    const response = {
        sendStatus() {}
    };
    let responseSpy: jest.SpyInstance;

    const session: { data: UserSessionData; regenerate(callback: () => void): void; save(callback: () => void): void } = {
        data: undefined,
        regenerate(callback: () => void){callback()},
        save(callback: () => void){callback()}
    }
    let sessionRegenerateSpy: jest.SpyInstance;
    let sessionSaveSpy: jest.SpyInstance;

    let saveSpy: jest.SpyInstance;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        repository = dataSource.getRepository<UserEntity>(UserEntity.name);

        responseSpy = jest.spyOn(response, 'sendStatus');
        sessionRegenerateSpy = jest.spyOn(session, 'regenerate');
        sessionSaveSpy = jest.spyOn(session, 'save');
        saveSpy = jest.spyOn(dataSource.getRepository(UserEntity.name), "save");
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        // Add a new user to the test
        user = new UserEntity("Foo", "Bar", "foo@bar.com");
        await user.setPassword("passwordpassword");
        await repository.save(user);

        // Clear spies
        jest.clearAllMocks();
    })

    afterEach(async () => {
        session.data = undefined;
        await dataSource.getRepository(UserEntity.name).clear();
        jest.clearAllMocks();
    })

    it('Should not modify the user in the database if the password is correct', async () => {
        const loginDto = new LoginDto("foo@bar.com", "passwordpassword");

        await login({body: loginDto, session} as Request, response as unknown as Response, repository)

        const dbUserAfterLogin = await repository.findOneBy({id: user.id});
        expect(dbUserAfterLogin).toEqual(user);
        expect(saveSpy).not.toHaveBeenCalled();
    })

    it('Should not modify the user in the database if the password is not correct', async () => {
        const loginDto = new LoginDto("foo@bar.com", "password");

        await login({body: loginDto, session} as Request, response as unknown as Response, repository)

        const dbUserAfterLogin = await repository.findOneBy({id: user.id});
        expect(dbUserAfterLogin).toEqual(user);
        expect(saveSpy).not.toHaveBeenCalled();
    })

    it('Should return code 200 if the email and password are valid', async () => {
        const loginDto = new LoginDto("foo@bar.com", "passwordpassword");

        await login({body: loginDto, session} as Request, response as unknown as Response, repository)

        expect(responseSpy).toHaveBeenCalledWith(200);
        expect(responseSpy).toHaveBeenCalledTimes(1);
    })

    it('Should return code 403 if the password is invalid', async () => {
        const loginDto = new LoginDto("foo@bar.com", "password");

        await login({body: loginDto, session} as Request, response as unknown as Response, repository)

        expect(responseSpy).toHaveBeenCalledWith(403);
        expect(responseSpy).toHaveBeenCalledTimes(1);
        expect(sessionRegenerateSpy).not.toHaveBeenCalled();
        expect(sessionSaveSpy).not.toHaveBeenCalled();
    })

    it('Should return code 403 if the email does not exist', async () => {
        const loginDto = new LoginDto("jane@doe.com", "passwordpassword");

        await login({body: loginDto, session} as Request, response as unknown as Response, repository)

        expect(responseSpy).toHaveBeenCalledWith(403);
        expect(responseSpy).toHaveBeenCalledTimes(1);
        expect(sessionRegenerateSpy).not.toHaveBeenCalled();
        expect(sessionSaveSpy).not.toHaveBeenCalled();
    })

    it('Should regenerate and save the session if the info is valid', async () => {
        const loginDto = new LoginDto("foo@bar.com", "passwordpassword");

        await login({body: loginDto, session} as Request, response as unknown as Response, repository)

        expect(sessionRegenerateSpy).toHaveBeenCalledTimes(1);
        expect(sessionSaveSpy).toHaveBeenCalledTimes(1);
        expect(session.data).toEqual({userId: user.id})
    })

    it('Should return code 500 if an error occurs during session regeneration', async () => {
        const loginDto = new LoginDto("foo@bar.com", "passwordpassword");

        // Create a new session mock to override the definition of {regenerate} without affecting the other tests
        const sessionMock: { data: UserSessionData; regenerate(callback: () => void): void; save(callback: () => void): void } = {
            data: undefined,
            regenerate(callback: (err: any) => void) {callback("this is an error")},
            save(callback: () => void){callback()}
        };
        const sessionRegenerateSpy = jest.spyOn(sessionMock, 'regenerate');
        const sessionSaveSpy = jest.spyOn(sessionMock, 'save');

        await login({body: loginDto, session: sessionMock} as Request, response as unknown as Response, repository)

        expect(responseSpy).toHaveBeenCalledWith(500);
        expect(responseSpy).toHaveBeenCalledTimes(1);
        expect(sessionRegenerateSpy).toHaveBeenCalledTimes(1);
        expect(sessionSaveSpy).not.toHaveBeenCalled();
    })

    it('Should return code 500 if an error occurs during session saving', async () => {
        const loginDto = new LoginDto("foo@bar.com", "passwordpassword");

        // Create a new session mock to override the definition of {save} without affecting the other tests
        const sessionMock: { data: UserSessionData; regenerate(callback: () => void): void; save(callback: () => void): void } = {
            data: undefined,
            regenerate(callback: () => void){callback()},
            save(callback: (err: any) => void) {callback("this is an error")}
        };
        const sessionRegenerateSpy = jest.spyOn(sessionMock, 'regenerate');
        const sessionSaveSpy = jest.spyOn(sessionMock, 'save');

        await login({body: loginDto, session: sessionMock} as Request, response as unknown as Response, repository)

        expect(responseSpy).toHaveBeenCalledWith(500);
        expect(responseSpy).toHaveBeenCalledTimes(1);
        expect(sessionRegenerateSpy).toHaveBeenCalledTimes(1);
        expect(sessionSaveSpy).toHaveBeenCalledTimes(1);
    })
})