import {
  clerkClient,
  getAuth,
  type Organization,
  type OrganizationMembership,
  type User,
} from '@clerk/tanstack-start/server';
import { getWebRequest } from 'vinxi/http';

import { graphql } from '@/gql';
import { Marketplace } from '@/gql/graphql';
import graphqlAPI from '../graphqlAPI';

export type ProfileType = {
  user: User;
  org?: Organization;
};

export type ProfileDisplayType = {
  isMarketplace: boolean;
  orgName?: string;
  displayName: string;
};

const ProfileQuery = graphql(`
  query Profile {
    account {
      name
      marketplace
    }
  }
`);

export const getProfileDisplay = async (): Promise<ProfileDisplayType> => {
  let orgName: string | undefined;
  let displayName: string;

  const res = await graphqlAPI.request(ProfileQuery);
  if (res.account.marketplace === Marketplace.Vercel) {
    // Vercel Marketplace users are not authed with Clerk.

    orgName = res.account.name ?? undefined;
    displayName = 'System';
  } else {
    const { user, org } = await getProfile();
    orgName = org?.name;
    displayName =
      user.firstName || user.lastName
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
        : user.username ?? '';
  }

  return {
    isMarketplace: res.account.marketplace === Marketplace.Vercel,
    orgName,
    displayName,
  };
};

export const getProfile = async (): Promise<ProfileType> => {
  const { orgId, userId } = await getAuth(getWebRequest());
  if (!userId) {
    throw new Error('User is not logged in');
  }

  const user = await clerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId);

  return { user, org: orgId ? await getOrg(orgId) : undefined };
};

export const getOrg = async (organizationId: string): Promise<Organization | undefined> => {
  if (!organizationId) {
    return undefined;
  }

  const orgs = (
    await clerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    }).organizations.getOrganizationMembershipList({
      organizationId,
    })
  ).data.map((o: OrganizationMembership) => o.organization);

  return orgs.find((o: Organization) => o.id === organizationId);
};
