import { Alert } from '@inngest/components/Alert/Alert';
import { Button } from '@inngest/components/Button';
import { Card } from '@inngest/components/Card/Card';

import EntitlementListItem from '@/components/Billing/Addons/EntitlementListItem';
import BillingInformation from '@/components/Billing/BillingDetails/BillingInformation';
import PaymentMethod from '@/components/Billing/BillingDetails/PaymentMethod';
import { LimitBar, type Data } from '@/components/Billing/LimitBar';
import { PlanNames } from '@/components/Billing/Plans/utils';
import {
  billingDetails as getBillingDetails,
  currentPlan as getCurrentPlan,
  entitlementUsage as getEntitlementUsage,
} from '@/components/Billing/data';
import { getBooleanFlag } from '@/components/FeatureFlags/ServerFeatureFlag';
import { day } from '@/utils/date';
import { pathCreator } from '@/utils/urls';

function kbyteDisplayValue(kibibytes: number): string {
  if (kibibytes >= 1024) {
    return `${(kibibytes / 1024).toFixed(2)} MiB`;
  }
  return `${kibibytes} KiB`;
}

export const dynamic = 'force-dynamic';

export default async function Page() {
  const entitlementUsage = await getEntitlementUsage();
  const { plan: currentPlan, subscription: currentSubscription } = await getCurrentPlan();
  const billing = await getBillingDetails();

  if (!currentPlan) {
    throw new Error('Failed to fetch current plan');
  }

  const refetch = async () => {
    'use server';
    await getCurrentPlan();
    await getEntitlementUsage();
    await getBillingDetails();
  };

  const legacyNoRunsPlan = entitlementUsage.runCount.limit === null;
  const runs: Data = {
    title: 'Runs',
    description: `${
      entitlementUsage.runCount.overageAllowed
        ? 'Additional usage incurred at additional charge.'
        : ''
    }`,
    current: entitlementUsage.runCount.usage || 0,
    limit: entitlementUsage.runCount.limit || null,
    overageAllowed: entitlementUsage.runCount.overageAllowed,
    tooltipContent: 'A single durable function execution.',
  };

  const steps: Data = {
    title: 'Steps',
    description: `${
      entitlementUsage.runCount.overageAllowed && !legacyNoRunsPlan
        ? 'Additional usage incurred at additional charge. Additional runs include 5 steps per run.'
        : entitlementUsage.runCount.overageAllowed
        ? 'Additional usage incurred at additional charge.'
        : ''
    }`,
    current: entitlementUsage.stepCount.usage || 0,
    limit: entitlementUsage.stepCount.limit || null,
    overageAllowed: entitlementUsage.stepCount.overageAllowed,
    tooltipContent: 'An individual step in durable functions.',
  };

  const nextInvoiceDate = currentSubscription?.nextInvoiceDate
    ? day(currentSubscription.nextInvoiceDate)
    : undefined;

  const nextInvoiceAmount = currentPlan.amount
    ? `$${(currentPlan.amount / 100).toFixed(2)}`
    : 'Free';
  const overageAllowed =
    entitlementUsage.runCount.overageAllowed || entitlementUsage.stepCount.overageAllowed;

  const paymentMethod = billing.paymentMethods?.[0] || null;

  const isProPlan = currentPlan.name === PlanNames.Pro;

  const enableSelfServiceFF = await getBooleanFlag('enable-addon-self-service');

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-2">
        {!overageAllowed && (
          <Alert
            severity="info"
            className="flex items-center justify-between text-sm"
            link={
              <Button
                appearance="outlined"
                kind="secondary"
                label="Upgrade plan"
                href={pathCreator.billing({ tab: 'plans', ref: 'app-billing-page-overview' })}
              />
            }
          >
            For usage beyond the limits of this plan, upgrade to a new plan.
          </Alert>
        )}

        <Card.Content>
          <p className="text-muted mb-1">Your plan</p>
          <div className="flex items-center justify-between">
            <p className="text-basis text-xl">{currentPlan.name}</p>
            <Button
              appearance="ghost"
              label="Change plan"
              href={pathCreator.billing({ tab: 'plans', ref: 'app-billing-page-overview' })}
            />
          </div>
          {!legacyNoRunsPlan && <LimitBar data={runs} className="my-4" />}
          <LimitBar data={steps} className="mb-6" />
          <div className="border-subtle mb-6 border" />
          <EntitlementListItem
            title="Event size"
            description="The maximum size for a single event"
            canIncreaseLimitInCurrentPlan={entitlementUsage.isCustomPlan}
            entitlement={{
              currentValue: entitlementUsage.eventSize.limit,
              displayValue: kbyteDisplayValue(entitlementUsage.eventSize.limit),
              planLimit: currentPlan.entitlements.eventSize.limit,
            }}
            enableSelfServiceFeatureFlag={enableSelfServiceFF}
          />
          <EntitlementListItem
            title="Concurrency"
            description="Maximum number of concurrently executing steps"
            tooltipContent="Functions actively sleeping and waiting for events are not counted"
            canIncreaseLimitInCurrentPlan={
              entitlementUsage.isCustomPlan || currentPlan.addons.concurrency.available
            }
            entitlement={{
              currentValue: entitlementUsage.concurrency.limit,
              displayValue: `${entitlementUsage.concurrency.limit} concurrent steps`,
              planLimit: currentPlan.entitlements.concurrency.limit,
              maxValue: 1000, // TODO: https://linear.app/inngest/issue/INN-4310/use-maxlimitincurrentplan-data-from-gql-in-the-addons-ui
            }}
            addon={{
              price: currentPlan.addons.concurrency.price,
              quantityPer: currentPlan.addons.concurrency.quantityPer,
              addonName: 'concurrency',
            }}
            onChange={refetch}
            enableSelfServiceFeatureFlag={enableSelfServiceFF}
          />
          <EntitlementListItem
            title="Users"
            description="Maximum number of users on the account"
            canIncreaseLimitInCurrentPlan={
              entitlementUsage.isCustomPlan || currentPlan.addons.userCount.available
            }
            entitlement={{
              currentValue: entitlementUsage.userCount.limit,
              displayValue: `${entitlementUsage.userCount.usage} of ${entitlementUsage.userCount.limit} maximum users`,
              planLimit: currentPlan.entitlements.userCount.limit,
              maxValue: 1000, // TODO: https://linear.app/inngest/issue/INN-4310/use-maxlimitincurrentplan-data-from-gql-in-the-addons-ui
            }}
            addon={{
              quantityPer: currentPlan.addons.userCount.quantityPer,
              price: currentPlan.addons.userCount.price,
              addonName: 'user_count',
            }}
            onChange={refetch}
            enableSelfServiceFeatureFlag={enableSelfServiceFF}
          />
          <EntitlementListItem
            title="Log history"
            description="View and search function run traces and metrics"
            canIncreaseLimitInCurrentPlan={entitlementUsage.isCustomPlan}
            entitlement={{
              currentValue: entitlementUsage.history.limit,
              displayValue: `${entitlementUsage.history.limit} day${
                entitlementUsage.history.limit === 1 ? '' : 's'
              }`,
              planLimit: currentPlan.entitlements.history.limit,
            }}
            enableSelfServiceFeatureFlag={enableSelfServiceFF}
          />
          <EntitlementListItem
            title="HIPAA"
            description="Sign BAAs for healthcare services"
            canIncreaseLimitInCurrentPlan={entitlementUsage.isCustomPlan || isProPlan} // TODO: https://linear.app/inngest/issue/INN-4310/use-maxlimitincurrentplan-data-from-gql-in-the-addons-ui
            entitlement={{
              currentValue: entitlementUsage.hipaa.enabled,
              displayValue: entitlementUsage.hipaa.enabled ? 'Enabled' : 'Not enabled',
            }}
            enableSelfServiceFeatureFlag={enableSelfServiceFF}
          />
          <EntitlementListItem
            title="Dedicated execution capacity"
            description="Dedicated infrastructure for the lowest latency and highest throughput"
            canIncreaseLimitInCurrentPlan={entitlementUsage.isCustomPlan}
            entitlement={{
              currentValue: false,
              displayValue: 'Not enabled', // TODO: https://linear.app/inngest/issue/INN-4202/add-dedicated-capacity-addon
            }}
            enableSelfServiceFeatureFlag={enableSelfServiceFF}
          />
          <div className="flex flex-col items-center gap-2 pt-6">
            <p className="text-muted text-xs">Custom needs?</p>
            <Button
              appearance="outlined"
              label="Chat with a product expert"
              href={pathCreator.support({ ref: 'app-billing-overview' })}
            />
          </div>
        </Card.Content>
      </Card>
      <div className="col-span-1">
        <Card className="mb-4">
          <Card.Content>
            <p className="text-muted mb-1">Next subscription payment</p>
            <p className="text-basis text-lg">
              {nextInvoiceAmount}
              {overageAllowed && <span className="text-tertiary-moderate">*</span>}
            </p>
            {nextInvoiceDate && (
              <>
                <p className="text-subtle mb-1 mt-4 text-xs font-medium">Payment due date</p>
                <p className="text-basis text-sm">{nextInvoiceDate}</p>
              </>
            )}
            {overageAllowed && (
              <p className="text-subtle mt-4 text-xs italic">
                <span className="text-tertiary-moderate">*</span>Base plan cost. Additional usage
                calculated at the start of the next billing cycle.
              </p>
            )}
          </Card.Content>
        </Card>
        <BillingInformation billingEmail={billing.billingEmail} accountName={billing.name} />
        <PaymentMethod paymentMethod={paymentMethod} />
      </div>
    </div>
  );
}
