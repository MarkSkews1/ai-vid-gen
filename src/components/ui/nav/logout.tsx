import { LogOut } from 'lucide-react';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/nav/mode-toggle';

export function LogoutButton() {
  return (
    <header className='animate-slide bg-background h-12 p-2 border-b sticky top-0 z-20'>
      <div className='flex h-8 items-center justify-between w-full'>
        <div className='flex items-center'>
          <ModeToggle />

          <Button
            variant='ghost'
            size='icon'
            aria-label='LogOut'
            title='LogOut'
            className='rounded-full'
            asChild
          >
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
