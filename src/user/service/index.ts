import type UserModel from '../model';
import { UserDto } from '../types';

export default class UserService {
    constructor(private model: UserModel) {}

    async findAll() {
        return this.model.findAll();
    }

    async findOne(id: string) {
        return this.model.findOne(id);
    }

    async create(userDto: UserDto) {
        return this.model.create(userDto);
    }

    async update(id: string, userDto: UserDto) {
        return this.model.update(id, userDto);
    }

    async delete(id: string) {
        return this.model.delete(id);
    }
}
