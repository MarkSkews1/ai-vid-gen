'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  RegisterLink,
  LoginLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ModeToggle } from './mode-toggle';
import { UserButton } from './user-button';

export default function TopNav() {
  const { user, isLoading } = useKindeBrowserClient();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Menubar className='flex items-center rounded-none h-14'>
      <div className='flex-none'>
        <MenubarMenu>
          <Link href='/'>
            <Image
              src='/images/logo.png'
              alt='ai video generator logo'
              width={50}
              height={50}
            />
          </Link>
        </MenubarMenu>
      </div>

      <div className='flex flex-grow items-center justify-end gap-3'>
        <MenubarMenu>
          <MenubarTrigger className='text-base font-normal'>
            Dashboard
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href={'/dashboard'}>Go to Dashboard</Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href={'/dashboard/create-video'}>Create Video</Link>
            </MenubarItem>
          </MenubarContent>
          <ModeToggle />

          {mounted && !isLoading && !user ? (
            <>
              <LoginLink postLoginRedirectURL='/dashboard'>Sign in</LoginLink>
              <RegisterLink postLoginRedirectURL='/login'>Sign up</RegisterLink>
            </>
          ) : null}

          {mounted && user ? <UserButton /> : null}
        </MenubarMenu>
      </div>
    </Menubar>
  );
}
