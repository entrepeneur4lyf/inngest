import type { Route } from 'next';
import { Link } from '@inngest/components/Link/Link';
import { IconVercel } from '@inngest/components/icons/platforms/Vercel';

import { getBooleanFlag } from '@/components/FeatureFlags/ServerFeatureFlag';
import VercelConnect from './connect';
import createVercelIntegration from './createVercelIntegration';
import VercelIntegrationCallbackPage from './oldPage';

export type VercelCallbackProps = {
  searchParams: {
    // OAuth 2.0 authorization code issued by Vercel’s authorization server. This code is valid for
    // 30 minutes and can be only exchanged once for a long-lived access token.
    code: string;
    // The ID of the Vercel team that the user has selected. It is passed only if the user is
    // installing the integration on a team.
    teamId?: string;
    // The ID of the Vercel integration’s configuration.
    configurationId: string;
    // Encoded URL to redirect the user once the installation process is finished.
    next: string;
    // Source defines where the integration was installed from.
    source: string;
  };
};

export default async function VercelCallbackPage({ searchParams }: VercelCallbackProps) {
  const newIntegrations = await getBooleanFlag('new-integrations');
  if (!searchParams.code) {
    throw new Error('Missing Vercel authorization code');
  }
  const vercelIntegration = await createVercelIntegration({
    vercelAuthorizationCode: searchParams.code,
  });

  return !newIntegrations ? (
    <VercelIntegrationCallbackPage
      searchParams={searchParams}
      vercelIntegration={vercelIntegration}
    />
  ) : (
    <div className="mx-auto mt-8 flex w-[800px] flex-col p-8">
      <div className="mb-7 flex h-12 w-12 items-center justify-center rounded bg-black">
        <IconVercel className="h-6 w-6 text-white" />
      </div>
      <div className="mb-2 text-xl font-medium text-slate-950">Connect Vercel to Inngest</div>
      <div className="mb-7 text-slate-600">
        Select the Vercel projects that have Inngest functions. You can optionally specify server
        route other than the default <span className="font-semibold">(`/api/inngest`)</span>.{' '}
        <Link showIcon={false} href={'/create-organization/set-up' as Route}>
          Learn more
        </Link>
      </div>
      <VercelConnect searchParams={searchParams} integrations={vercelIntegration} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
