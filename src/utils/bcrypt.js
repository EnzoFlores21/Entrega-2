import bycrypt from "bcrypt";

export const createHash = password => bycrypt.hashSync(password, bycrypt.genSaltSync(10));


export const isValidPassword = (user, password) => {
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bycrypt.compareSync(password, user.password);
}