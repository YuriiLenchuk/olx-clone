import api from "@/api";
import ErrorHandler from "@/services/ErrorHandler";

interface User {
    username: string;
    password: string;
}

class UserService {
     static registration = async({username, password}:User) => {
         const body = {username, password}
        try {
            const user = await api.post('/auth/registration', body)
            return user.data;
        } catch (e) {
            console.log(e)
        }
    }
    static login = async({username, password}:User) => {
        const body = {username, password}
        try {
            const user = await api.post('/auth/login', body)
            console.log(user, "data")
            return user.data;
        } catch (e:any) {
            console.log(e, "error")
            throw new ErrorHandler(e?.response?.data);
        }
    }
}


export default UserService;