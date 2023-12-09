export const generateToken = async (data: string | object)
    : Promise<string> => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: data
    }, process.env.JWT_SECRET);
    return token;
}

export const verifyToken = async (token: string):
    Promise<{ valid: boolean, data: string | object | null }> => {
    try {
        const jwt = require('jsonwebtoken');
        const decode = await jwt.verify(token, process.env.JWT_SECRET)
        return { valid: true, data: decode.data }
    } catch (error: any) {
    }

    return { valid: false, data: null };
}