'use client';

import type { ReactNode } from 'react';
import NextLink from 'next/link';
import { SignOutButton } from '@clerk/nextjs';
import { Listbox } from '@headlessui/react';
import {
  RiArrowLeftRightLine,
  RiBillLine,
  RiEqualizerLine,
  RiGroupLine,
  RiLogoutCircleLine,
  RiUserLine,
} from '@remixicon/react';

import { pathCreator } from '@/utils/urls';

export const ProfileMenu = ({ children }: { children: ReactNode }) => {
  return (
    <Listbox>
      <Listbox.Button className="w-full cursor-pointer ring-0">{children}</Listbox.Button>
      <div className="relative">
        <Listbox.Options className="bg-canvasBase absolute -right-48 bottom-4 z-50 ml-8 w-[199px] rounded border shadow ring-0 focus:outline-none">
          <NextLink href="/settings/organization" scroll={false}>
            <Listbox.Option
              className="text-muted hover:bg-canvasSubtle mx-2 mt-2 flex h-8 cursor-pointer items-center px-2 text-[13px]"
              value="org"
            >
              <div className="hover:bg-canvasSubtle flex flex-row items-center justify-start">
                <RiEqualizerLine className="text-muted mr-2 h-4 w-4 " />
                <div>Your Organization</div>
              </div>
            </Listbox.Option>
          </NextLink>
          <NextLink href="/settings/organization/organization-members" scroll={false}>
            <Listbox.Option
              className="text-muted hover:bg-canvasSubtle mx-2 mt-2 flex h-8 cursor-pointer items-center px-2 text-[13px]"
              value="members"
            >
              <div className="hover:bg-canvasSubtle flex flex-row items-center justify-start">
                <RiGroupLine className="text-muted mr-2 h-4 w-4" />
                <div>Members</div>
              </div>
            </Listbox.Option>
          </NextLink>
          <NextLink href={pathCreator.billing()} scroll={false}>
            <Listbox.Option
              className="text-muted hover:bg-canvasSubtle mx-2 mt-2 flex h-8 cursor-pointer items-center px-2 text-[13px]"
              value="billing"
            >
              <div className="hover:bg-canvasSubtle flex flex-row items-center justify-start">
                <RiBillLine className="text-muted mr-2 h-4 w-4" />
                <div>Billing</div>
              </div>
            </Listbox.Option>
          </NextLink>
          <a href="/organization-list">
            <Listbox.Option
              className="text-muted hover:bg-canvasSubtle m-2 flex h-8 cursor-pointer items-center px-2 text-[13px]"
              value="switchOrg"
            >
              <div className="hover:bg-canvasSubtle flex flex-row items-center justify-start">
                <RiArrowLeftRightLine className="text-muted mr-2 h-4 w-4" />
                <div>Switch Organization</div>
              </div>
            </Listbox.Option>
          </a>

          <hr />

          <NextLink href="/settings/user" scroll={false}>
            <Listbox.Option
              className="text-muted hover:bg-canvasSubtle mx-2 mt-2 flex h-8 cursor-pointer items-center px-2 text-[13px]"
              value="userProfile"
            >
              <div className="hover:bg-canvasSubtle flex flex-row items-center justify-start">
                <RiUserLine className="text-muted mr-2 h-4 w-4" />
                <div>Your Profile</div>
              </div>
            </Listbox.Option>
          </NextLink>
          <Listbox.Option
            className="text-muted hover:bg-canvasSubtle m-2 flex h-8 cursor-pointer items-center px-2 text-[13px]"
            value="signOut"
          >
            <SignOutButton>
              <div className="hover:bg-canvasSubtle flex flex-row items-center justify-start">
                <RiLogoutCircleLine className="text-muted mr-2 h-4 w-4" />
                <div>Sign Out</div>
              </div>
            </SignOutButton>
          </Listbox.Option>
        </Listbox.Options>
      </div>
    </Listbox>
  );
};
