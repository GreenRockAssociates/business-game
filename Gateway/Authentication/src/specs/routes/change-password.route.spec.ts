import {DataSource, Repository} from "typeorm";
import {UserEntity} from "../../entities/user.entity";
import {AppDataSource} from "../../libraries/database";
import {ChangePasswordDto} from "../../dto/change-password.dto";
import * as bcrypt from "bcrypt"
import {changePassword} from "../../api/routes/change-password.route";
import {Request, Response} from "express";

describe("Change password route", () => {
    let dataSource: DataSource;
    let repository: Repository<UserEntity>
    let user: UserEntity;

    const response = {
        sendStatus() {}
    };
    let responseSpy: jest.SpyInstance;

    beforeAll(async () => {
        dataSource = await AppDataSource.initialize().catch((error: Error) => {
            throw new Error(`Error initializing database: ${error.message}`);
        });
        repository = dataSource.getRepository<UserEntity>(UserEntity.name);

        responseSpy = jest.spyOn(response, 'sendStatus');
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    beforeEach(async () => {
        await repository.clear();
        // Add a new user to the test
        user = new UserEntity("Foo", "Bar", "foo@bar.com");
        await user.setPassword("passwordpassword");
        await repository.save(user);

        // Clear spies
        jest.clearAllMocks();
    })

    afterEach(async () => {
        await dataSource.getRepository(UserEntity.name).clear();
        jest.clearAllMocks();
    })

    it("Should change the password if the old password is correct", async () => {
        const newPassword = "azertyuiopqsdfghjklm";
        const changePasswordDto = new ChangePasswordDto("passwordpassword", newPassword);
        const request = {
            body: changePasswordDto,
            session : {
                data : {
                    userId: user.id
                }
            }
        };

        await changePassword(request as Request, response as unknown as Response, repository);

        const userAfterRoute = await repository.findOneBy({
            id: user.id
        })

        await expect(bcrypt.compare(newPassword, userAfterRoute.passwordHash)).resolves.toBeTruthy();
    })

    it("Should return 200 if the change was a success", async () => {
        const newPassword = "azertyuiopqsdfghjklm";
        const changePasswordDto = new ChangePasswordDto("passwordpassword", newPassword);
        const request = {
            body: changePasswordDto,
            session : {
                data : {
                    userId: user.id
                }
            }
        };

        await changePassword(request as Request, response as unknown as Response, repository);

        expect(responseSpy).toHaveBeenCalledWith(200);
        expect(responseSpy).toHaveBeenCalledTimes(1);
    })

    it("Should refuse to change the password if the old password is incorrect", async () => {
        const newPassword = "azertyuiopqsdfghjklm";
        const changePasswordDto = new ChangePasswordDto("wrong password", newPassword);
        const request = {
            body: changePasswordDto,
            session : {
                data : {
                    userId: user.id
                }
            }
        };

        await changePassword(request as Request, response as unknown as Response, repository);

        const userAfterRoute = await repository.findOneBy({
            id: user.id
        })

        await expect(bcrypt.compare(newPassword, userAfterRoute.passwordHash)).resolves.toBeFalsy();
        await expect(bcrypt.compare("passwordpassword", userAfterRoute.passwordHash)).resolves.toBeTruthy();
        expect(userAfterRoute).toEqual(user);
    })

    it("Should return 401 is the old password is incorrect", async () => {
        const newPassword = "azertyuiopqsdfghjklm";
        const changePasswordDto = new ChangePasswordDto("wrong password", newPassword);
        const request = {
            body: changePasswordDto,
            session : {
                data : {
                    userId: user.id
                }
            }
        };

        await changePassword(request as Request, response as unknown as Response, repository);

        expect(responseSpy).toHaveBeenCalledWith(401);
        expect(responseSpy).toHaveBeenCalledTimes(1);
    })

    it("Should return 401 if the user in the session doesn't exist", async () => {
        await repository.clear();

        const changePasswordDto = new ChangePasswordDto("wrong password", "azertyuiopqsdfghjklm");
        const request = {
            body: changePasswordDto,
            session : {
                data : {
                    userId: user.id
                }
            }
        };

        await changePassword(request as Request, response as unknown as Response, repository);

        expect(responseSpy).toHaveBeenCalledWith(401);
        expect(responseSpy).toHaveBeenCalledTimes(1);
    })
})