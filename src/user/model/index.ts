import { v4 as uuidv4 } from 'uuid';
import ServerErrors, { isServerError } from '../../errors';
import { User, UserDto } from '../types';

function handleUnknownError<This, Args extends unknown[], Return>(
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
    constructor(private database: User[]) {}

    @handleUnknownError
    async findAll() {
        return this.database;
    }

    @handleUnknownError
    async findOne(id: string) {
        const user = this.database.find((u) => u.id === id);
        if (!user) throw ServerErrors.NoUser;

        return user;
    }

    @handleUnknownError
    async create(userDto: UserDto) {
        const newUser: User = { ...userDto, id: uuidv4() };

        this.database.push(newUser);
        return newUser;
    }

    @handleUnknownError
    async update(id: string, userDto: UserDto) {
        const userIndex = this.database.findIndex((u) => u.id === id);
        if (userIndex === -1) throw ServerErrors.NoUser;

        this.database[userIndex] = { ...userDto, id };

        return this.database[userIndex];
    }

    @handleUnknownError
    async delete(id: string) {
        const user = this.database.find((u) => u.id === id);
        if (!user) throw ServerErrors.NoUser;

        this.database = this.database.filter((u) => u.id !== id);

        return this.database;
    }
}
