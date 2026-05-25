"use client"
import UserService from "@/services/UserService";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import {ForgetPasswordInput, FormButton, SubmitButton, WrapperForm, WrapperFormContainer, WrapperInput} from './styled';

type Inputs = {
    user: string
    password: string
}
interface User {
    user: string,
    password: string,
}

export default function Auth() {
    const [variant, setVariant] = useState<string>('isRegister');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const onClick = (data:User) => {
        console.log("onClick");
        switch (variant) {
            case 'isRegister': UserService.registration({username: data.user, password: data.password}).then(r => {
                document.cookie = `authToken=${r.token};`
                return router.push("/home");
            }); break;
            case 'isLogin': UserService.login({username: data.user, password: data.password}).then(r => {
                console.log(1234)
                document.cookie = `authToken=${r.token};`
                return router.push("/home");
            }).catch(e => {
                console.log(123)
                setError(e?.response?.data)
            }); break;
        }

    }
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()

    return (
        variant === "isRegister" ? (
            <div style={{
                display: 'flex',
                justifyContent: "center",
                alignItems: "center",
                height: '100vh',
                width: '100vw'
            }}>
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
                        {error && <span>This field is required</span>}
                        <div style={{alignSelf: "center", margin: "16px 0 0 0"}}></div>
                        <SubmitButton value="Зареєструватися" type="submit"/>
                    </WrapperForm>
                </WrapperFormContainer>
            </div>
        ) : (
            <div style={{
                display: 'flex',
                justifyContent: "center",
                alignItems: "center",
                height: '100vh',
                width: '100wh'
            }}>
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
                        {errors.password && <span>This field is required</span>}
                        <div style={{alignSelf: "center", margin: "16px 0 0 0"}}></div>
                        <div>
                            <ForgetPasswordInput href={"/forgetpassword"}>Забули пароль?</ForgetPasswordInput>
                        </div>
                        {error && <p role="alert">{error}</p>}
                        <SubmitButton value="Увійти" type="submit"/>
                    </WrapperForm>
                </WrapperFormContainer>
            </div>
        )
    )
}