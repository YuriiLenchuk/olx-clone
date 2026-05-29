import React from 'react';

import RouteTransition from '@/components/routeTransition/routeTransition';

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <RouteTransition variant='auth'>
            {children}
        </RouteTransition>
    );
}