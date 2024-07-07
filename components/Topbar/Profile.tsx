'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

type Props = {};

const Profile = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleLogoutClick = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className='relative'>
      <div
        className='border-2 border-green-400 rounded-full w-[50px] h-[50px] overflow-hidden cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          src={session?.user?.image_url!}
          alt="Profile"
        />
      </div>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50'>
          <button
            className='w-full px-4 py-2 text-left hover:bg-gray-100'
            onClick={handleProfileClick}
          >
            Profile
          </button>
          <button
            className='w-full px-4 py-2 text-left hover:bg-gray-100'
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
