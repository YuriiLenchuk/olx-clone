'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import { TransitionSlot } from './styled';

type Props = {
    children: ReactNode;
    variant?: 'main' | 'auth';
};

export default function RouteTransition({
                                            children,
                                            variant = 'main',
                                        }: Props) {
    const pathname = usePathname();

    return (
        <TransitionSlot key={pathname} $variant={variant}>
            {children}
        </TransitionSlot>
    );
}