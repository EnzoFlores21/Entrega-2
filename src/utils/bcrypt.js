import bycrypt from "bcrypt";
import { SALT_NUMBER } from "../constants/salt.constant.js";

export const createHash = password => bycrypt.hashSync(password, bycrypt.genSaltSync(SALT_NUMBER));



export const isValidPassword = (user, password) => {
    return bycrypt.compareSync(password, user.password);
}