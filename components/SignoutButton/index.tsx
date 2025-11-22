'use client'

import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignoutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push('/auth/login');
                },
            },
        });
    };

    return (
        <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
        </Button>
    );
}