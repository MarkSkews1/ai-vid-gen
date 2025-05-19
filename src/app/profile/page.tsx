import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function ProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className='container mx-auto p-6'>
      <div className='bg-card rounded-lg shadow-lg p-6'>
        <h1 className='text-3xl font-bold mb-6'>Your Profile</h1>

        <div className='space-y-4'>
          <div>
            <h2 className='text-xl font-semibold'>Personal Information</h2>
            <div className='mt-2'>
              <p>
                <span className='font-medium'>Name:</span> {user?.given_name}{' '}
                {user?.family_name}
              </p>
              <p>
                <span className='font-medium'>Email:</span> {user?.email}
              </p>
              <p>
                <span className='font-medium'>ID:</span> {user?.id}
              </p>
            </div>
          </div>

          <div className='mt-8'>
            <h2 className='text-xl font-semibold'>Account Settings</h2>
            <p className='text-muted-foreground'>
              Manage your account preferences and settings
            </p>
            {/* Additional account settings could be added here */}
          </div>
        </div>
      </div>
    </div>
  );
}
