import { NewButton } from '@inngest/components/Button';
import { InfoCallout } from '@inngest/components/Callout';
import { Link } from '@inngest/components/Link';
import { IconVercel } from '@inngest/components/icons/platforms/Vercel';

export default function VercelConnect() {
  return (
    <div className="mx-auto mt-16 flex w-[800px] flex-col">
      <div className="text-basis mb-7 flex flex-row items-center justify-start text-2xl font-medium">
        <div className="bg-contrast mr-4 flex h-12 w-12 items-center justify-center rounded">
          <IconVercel className="text-onContrast" size={20} />
        </div>
        Vercel
      </div>
      <div className="text-subtle mb-7 w-full text-base font-normal">
        This integration enables you to host your Inngest functions on the Vercel platform and
        automatically sync them every time you deploy code.{' '}
        <Link showIcon={false} href="https://www.inngest.com/docs/deploy/vercel">
          Read documentation
        </Link>
      </div>
      <div className="mb-7">
        <InfoCallout text="Please note that each Vercel account can only be linked to one Inngest account at a time." />
      </div>
      <div className="text-basis mb-7 text-lg font-normal">Installation overview</div>
      <div className="text-basis text-lg font-normal">
        <div className="border-subtle ml-3 border-l">
          <div className="before:border-subtle before:text-basis relative ml-[32px] pb-7 before:absolute before:left-[-46px] before:h-[28px] before:w-[28px] before:rounded-full before:border before:bg-white before:text-center before:align-middle before:text-[13px] before:content-['1']">
            <div className="text-basis text-base">Install Inngest Integration on Vercel.</div>
            <div className="text-subtle text-base">
              Click the &rdquo;Add Integration&rdquo; button.
            </div>
          </div>
        </div>

        <div className="border-subtle ml-3 border-l">
          <div className="before:border-subtle before:text-basis relative ml-[32px] pb-7 before:absolute before:left-[-46px] before:h-[28px] before:w-[28px] before:rounded-full before:border before:bg-white before:text-center before:align-middle before:text-[13px] before:content-['2']">
            <div className="text-basis text-base">
              Select the Vercel projects you wish to enable
            </div>
            <div className="text-subtle text-base">
              You can configure one or more serve endpoints.
            </div>
          </div>
        </div>
        <div className="ml-3">
          <div className="before:border-subtle before:text-basis relative ml-[32px] pb-7 before:absolute before:left-[-46px] before:h-[28px] before:w-[28px] before:rounded-full before:border before:bg-white before:text-center before:align-middle before:text-[13px] before:content-['3']">
            <div className="text-basis text-base">Setup Successful</div>
            <div className="text-subtle text-base">
              The integration auto-configures necessary environment variables and syncs your app
              with Inngest whenever you deploy code to Vercel.
            </div>
          </div>
        </div>
      </div>
      <div>
        <NewButton
          appearance="solid"
          href="https://vercel.com/integrations/inngest"
          label="Connect Vercel to Inngest"
        />
      </div>
    </div>
  );
}
