import CrudRepository from "./crud.repository.js";
import { User } from "../models/index.js";

class UserRepository extends CrudRepository {
  constructor() {
    super(User);
  }
}

export default new UserRepository();
