import ServerErrors from '../../errors';
import type UserModel from '../model';
import { UserDto } from '../types';
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

    async create(userDto: UserDto) {
        if (!isValidUserDto(userDto)) {
            throw ServerErrors.InvalidUserBody;
        }

        return this.model.create(userDto);
    }

    async update(id: string, userDto: UserDto) {
        if (!isValidUUID(id)) throw ServerErrors.InvalidId;

        return this.model.update(id, userDto);
    }

    async delete(id: string) {
        if (!isValidUUID(id)) throw ServerErrors.InvalidId;

        return this.model.delete(id);
    }
}
