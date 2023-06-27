import { v4 as uuidv4 } from 'uuid';
import ServerErrors from '../../errors';
import { isServerError } from '../../errors/helpers';
import { UserData } from '../../types';
import { UserDto } from '../types';
import { checkIsValidUUID, isValidUserBody } from './helpers';

function handleSystemError<This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ClassMethodDecoratorContext<
        This,
        (this: This, ...args: Args) => Promise<Return>
    >,
) {
    return async function replacementMethod(
        this: This,
        ...args: Args
    ): Promise<Return> {
        try {
            return await target.call(this, ...args);
        } catch (error) {
            if (!isServerError(error)) {
                throw ServerErrors.Internal;
            }
            throw error;
        }
    };
}

export default class UserModel {
    constructor(private database: UserData[]) {}

    @handleSystemError
    async findAll() {
        return this.database;
    }

    @handleSystemError
    async findOne(id: string) {
        if (!checkIsValidUUID(id)) {
            throw ServerErrors.InvalidId;
        }

        const user = this.database.find((u) => u.id === id);
        if (!user) throw ServerErrors.NoUser;

        return user;
    }

    @handleSystemError
    async create(userDto: UserDto) {
        if (!isValidUserBody(userDto)) {
            throw ServerErrors.InvalidUserBody;
        }

        const newUser: UserData = { ...userDto, id: uuidv4() };

        this.database.push(newUser);
        return newUser;
    }

    @handleSystemError
    async update(id: string, userDto: UserDto) {
        if (!checkIsValidUUID(id)) throw ServerErrors.InvalidId;

        const userIndex = this.database.findIndex((u) => u.id === id);
        if (userIndex === -1) throw ServerErrors.NoUser;

        this.database[userIndex] = { ...userDto, id };

        return this.database[userIndex];
    }

    @handleSystemError
    async delete(id: string) {
        if (!checkIsValidUUID(id)) throw ServerErrors.InvalidId;

        const user = this.database.find((u) => u.id === id);
        if (!user) throw ServerErrors.NoUser;

        this.database = this.database.filter((u) => u.id !== id);

        return this.database;
    }
}
