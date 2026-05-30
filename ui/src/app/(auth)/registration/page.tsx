"use client"
import UserService from "@/services/UserService";
import {useEffect, useState} from "react";
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import {
    ErrorAlert,
    ForgetPasswordInput,
    FormButton,
    SubmitButton, VariantPanel,
    Wrapper,
    WrapperForm,
    WrapperFormContainer,
    WrapperInput
} from './styled';

import { getValidAuthToken, removeAuthToken, setAuthToken } from "@/Utils/authToken";

type Inputs = {
    user: string
    password: string
}
interface User {
    user: string,
    password: string,
}

function getAuthErrorMessage(error: any, fallback: string) {
    return error?.message || error?.response?.data?.message || fallback;
}

export default function Auth() {
    const router = useRouter();
    useEffect(() => {
        let isMounted = true;

        async function checkExistingSession() {
            const token = getValidAuthToken();

            if (!token) return;

            try {
                await UserService.me(token);

                if (isMounted) {
                    router.replace('/auth/me');
                }
            } catch {
                removeAuthToken();
            }
        }

        checkExistingSession();

        return () => {
            isMounted = false;
        };
    }, [router]);

    const [variant, setVariant] = useState<string>('isLogin');
    const [error, setError] = useState<string | null>(null);
    function getAuthErrorMessage(error: any, fallback: string) {
        if (typeof error === 'string') return error;
        if (typeof error?.message === 'string') return error.message;
        if (typeof error?.response?.data === 'string') return error.response.data;
        if (typeof error?.response?.data?.message === 'string') {
            return error.response.data.message;
        }

        return fallback;
    }

    const onClick = async (data: User) => {
        setError(null);

        try {
            if (variant === 'isRegister') {
                const response = await UserService.registration({
                    username: data.user,
                    password: data.password,
                });

                setAuthToken(response.token);
                router.replace('/auth/me');
                router.refresh();
                return;
            }

            const response = await UserService.login({
                username: data.user,
                password: data.password,
            });

            setAuthToken(response.token);
            router.push('/auth/me');
        } catch (e: any) {
            setError(
                getAuthErrorMessage(
                    e,
                    variant === 'isRegister'
                        ? 'Не вдалося зареєструватися'
                        : 'Не вдалося увійти',
                ),
            );
        }
    };
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    return (
        variant === "isRegister" ? (
            <Wrapper>
                {error && <ErrorAlert role="alert">{error}</ErrorAlert>}
                <VariantPanel key={variant}>
                    <WrapperFormContainer>
                        <div>
                            <FormButton $active={false} onClick={() => setVariant('isLogin')}>Увійти</FormButton>
                            <FormButton $active={true} onClick={() => setVariant('isRegister')}>Зареєструватись</FormButton>
                        </div>
                        <WrapperForm onSubmit={handleSubmit(onClick)}>
                            <WrapperInput>
                                <label>Електронна пошта чи телефон</label>
                                <input defaultValue="test" {...register("user", {required: true})} />
                            </WrapperInput>
                            <WrapperInput>
                                <label>Пароль</label>
                                <input type={"password"} {...register("password", {required: true})} />
                                <div>
                                    <p>Ваш пароль має містити:</p>
                                    <span><span> - </span>9 або більше символів</span>
                                    <span><span> - </span>Велику літеру</span>
                                    <span><span> - </span>Малу літеру</span>
                                    <span><span> - </span>Мінімум одну цифру</span>
                                </div>
                            </WrapperInput>
                            <div style={{alignSelf: "center", margin: "16px 0 0 0"}}></div>
                            <SubmitButton value="Зареєструватися" type="submit"/>
                        </WrapperForm>
                    </WrapperFormContainer>
                </VariantPanel>
            </Wrapper>
        ) : (
            <Wrapper>
                {error && <ErrorAlert role="alert">{error}</ErrorAlert>}
                <VariantPanel key={variant}>
                    <WrapperFormContainer>
                        <div>
                            <FormButton $active={true} onClick={() => setVariant('isLogin')}>Увійти</FormButton>
                            <FormButton $active={false} onClick={() => setVariant('isRegister')}>Зареєструватись</FormButton>
                        </div>
                        <WrapperForm onSubmit={handleSubmit(onClick)}>
                            <WrapperInput>
                                <label>Електронна пошта чи телефон</label>
                                <input defaultValue="test" {...register("user", {required: true})} />
                            </WrapperInput>
                            <WrapperInput>
                                <label>Пароль</label>
                                <input type={"password"} {...register("password", {required: true})} />
                            </WrapperInput>

                            <div style={{alignSelf: "center", margin: "16px 0 0 0"}}></div>
                            <div>
                                <ForgetPasswordInput href={"/forgetpassword"}>Забули пароль?</ForgetPasswordInput>
                            </div>
                            <SubmitButton value="Увійти" type="submit"/>
                        </WrapperForm>
                    </WrapperFormContainer>
                </VariantPanel>
            </Wrapper>
        )
    )
}