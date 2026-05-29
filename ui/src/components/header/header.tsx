'use client';

import {useCallback, useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';

import UserService, { AuthUser } from '@/services/UserService';
import {
    AUTH_TOKEN_EVENT,
    getAuthToken,
    removeAuthToken,
} from '@/Utils/authToken';

import {
    ActionButton,
    BrandLink,
    BrandMark,
    HeaderInner,
    Nav,
    ProfileAvatar,
    ProfileLink,
    ProfileText,
    StyledHeader,
    WrapperLink,
} from './styled';

function getDisplayName(user: AuthUser | null) {
    if (!user) return 'Профіль';

    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    return fullName || user.username || 'Профіль';
}

function getInitial(user: AuthUser | null) {
    const name = getDisplayName(user);

    return name.charAt(0).toUpperCase();
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const loadUser = useCallback(async () => {
        const token = getAuthToken();

        if (!token) {
            setUser(null);
            setIsAuthChecked(true);
            return;
        }

        try {
            setIsAuthChecked(false);

            const userData = await UserService.me(token);

            setUser(userData);
        } catch {
            setUser(null);
            removeAuthToken();
        } finally {
            setIsAuthChecked(true);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser, pathname]);

    useEffect(() => {
        function handleAuthChanged() {
            loadUser();
        }

        function handleStorage(event: StorageEvent) {
            if (event.key === AUTH_TOKEN_EVENT) {
                loadUser();
            }
        }

        window.addEventListener(AUTH_TOKEN_EVENT, handleAuthChanged);
        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener(AUTH_TOKEN_EVENT, handleAuthChanged);
            window.removeEventListener('storage', handleStorage);
        };
    }, [loadUser]);

    return (
        <StyledHeader>
            <HeaderInner>
                <BrandLink href="/home">
                    <BrandMark>LM</BrandMark>
                    Local Market
                </BrandLink>

                <Nav>
                    <WrapperLink href="/wish-list">Збережене</WrapperLink>

                    <ProfileLink href={user ? '/auth/me' : '/registration'}>
                        {user && <ProfileAvatar>{getInitial(user)}</ProfileAvatar>}

                        <ProfileText>
                            <span>{user ? 'Ваш акаунт' : ''}</span>
                            <strong>
                                {isAuthChecked ? getDisplayName(user) : 'Профіль'}
                            </strong>
                        </ProfileText>
                    </ProfileLink>

                    <ActionButton
                        onClick={() => router.push('/add')}
                        type="button"
                    >
                        + Оголошення
                    </ActionButton>
                </Nav>
            </HeaderInner>
        </StyledHeader>
    );
}