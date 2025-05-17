import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ModeToggle } from './mode-toggle';

export default function TopNav() {
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
            <MenubarItem>Task1</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Task2</MenubarItem>
          </MenubarContent>
          <ModeToggle />
        </MenubarMenu>
      </div>
    </Menubar>
  );
}
