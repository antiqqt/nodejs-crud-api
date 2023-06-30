import ServerErrors from '../../errors';
import type UserModel from '../model';
import { isValidUUID, isValidUserDto } from './helpers';

export default class UserMiddleware {
    constructor(private model: UserModel) {}

    async findAll() {
        return this.model.findAll();
    }

    async findOne(id: string) {
        if (!isValidUUID(id)) {
            throw ServerErrors.InvalidId;
        }

        return this.model.findOne(id);
    }

    async create(userDto: unknown) {
        if (!isValidUserDto(userDto)) {
            throw ServerErrors.InvalidUserBody;
        }

        return this.model.create(userDto);
    }

    async update(id: string, userDto: unknown) {
        if (!isValidUUID(id)) throw ServerErrors.InvalidId;
        if (!isValidUserDto(userDto)) {
            throw ServerErrors.InvalidUserBody;
        }

        return this.model.update(id, userDto);
    }

    async delete(id: string) {
        if (!isValidUUID(id)) throw ServerErrors.InvalidId;

        return this.model.delete(id);
    }
}
