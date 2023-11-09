import AuthService from "@/services/AuthService";
import Cookies from "js-cookie";
import { User } from "@/services/AuthService";
import { useRouter } from "next/navigation";

export const useLogin = () => {
    const router = useRouter();

    const login = async (username: string, password: string) => {
        const _as = new AuthService();
        const user = await _as.login(username, password);
        if (user && "jwt" in user) {
            Cookies.set('currentUser', JSON.stringify(user as User));
            router.push('/profile');
        }
        return user;
    }

    return { login };
}
