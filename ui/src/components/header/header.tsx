'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import UserService, { AuthUser } from '@/services/UserService';
import {
    AUTH_TOKEN_EVENT,
    getAuthToken,
    getValidAuthToken,
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

    const isLoadingUserRef = useRef(false);
    const requestIdRef = useRef(0);

    const loadUser = useCallback(async () => {
        const token = getValidAuthToken();

        if (!token) {
            setUser(null);
            setIsAuthChecked(true);
            return;
        }

        if (isLoadingUserRef.current) return;

        const requestId = requestIdRef.current + 1;

        requestIdRef.current = requestId;
        isLoadingUserRef.current = true;

        try {
            setIsAuthChecked(false);

            const userData = await UserService.me(token);

            if (requestIdRef.current === requestId) {
                setUser(userData);
            }
        } catch {
            if (getAuthToken() === token) {
                removeAuthToken();
            }

            if (requestIdRef.current === requestId) {
                setUser(null);
            }
        } finally {
            if (requestIdRef.current === requestId) {
                setIsAuthChecked(true);
            }

            isLoadingUserRef.current = false;
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