/* eslint-disable */

import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  mutation SetUpAccount {\n    setUpAccount {\n      account {\n        id\n      }\n    }\n  }\n':
    types.SetUpAccountDocument,
  '\n  mutation CreateUser {\n    createUser {\n      user {\n        id\n      }\n    }\n  }\n':
    types.CreateUserDocument,
  '\n  query GetBillingInfo {\n    account {\n      entitlements {\n        stepCount {\n          usage\n          limit\n        }\n        runCount {\n          usage\n          limit\n        }\n      }\n    }\n  }\n':
    types.GetBillingInfoDocument,
  '\n  mutation CreateEnvironment($name: String!) {\n    createWorkspace(input: { name: $name }) {\n      id\n    }\n  }\n':
    types.CreateEnvironmentDocument,
  '\n  mutation AchiveApp($appID: UUID!) {\n    archiveApp(id: $appID) {\n      id\n    }\n  }\n':
    types.AchiveAppDocument,
  '\n  mutation UnachiveApp($appID: UUID!) {\n    unarchiveApp(id: $appID) {\n      id\n    }\n  }\n':
    types.UnachiveAppDocument,
  '\n  mutation ResyncApp($appExternalID: String!, $appURL: String, $envID: UUID!) {\n    resyncApp(appExternalID: $appExternalID, appURL: $appURL, envID: $envID) {\n      app {\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n':
    types.ResyncAppDocument,
  '\n  query CheckApp($envID: ID!, $url: String!) {\n    env: workspace(id: $envID) {\n      appCheck(url: $url) {\n        apiOrigin {\n          value\n        }\n        appID {\n          value\n        }\n        authenticationSucceeded {\n          value\n        }\n        env {\n          value\n        }\n        error\n        eventAPIOrigin {\n          value\n        }\n        eventKeyStatus\n        extra\n        framework {\n          value\n        }\n        isReachable\n        isSDK\n        mode\n        respHeaders\n        respStatusCode\n        sdkLanguage {\n          value\n        }\n        sdkVersion {\n          value\n        }\n        serveOrigin {\n          value\n        }\n        servePath {\n          value\n        }\n        signingKeyStatus\n        signingKeyFallbackStatus\n      }\n    }\n  }\n':
    types.CheckAppDocument,
  '\n  query Sync($envID: ID!, $externalAppID: String!, $syncID: ID!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        externalID\n        name\n        method\n      }\n    }\n    sync: deploy(id: $syncID) {\n      commitAuthor\n      commitHash\n      commitMessage\n      commitRef\n      error\n      framework\n      id\n      lastSyncedAt\n      platform\n      repoURL\n      sdkLanguage\n      sdkVersion\n      status\n      removedFunctions: removedFunctions {\n        id\n        name\n        slug\n      }\n      syncedFunctions: deployedFunctions {\n        id\n        name\n        slug\n      }\n      url\n      vercelDeploymentID\n      vercelDeploymentURL\n      vercelProjectID\n      vercelProjectURL\n    }\n  }\n':
    types.SyncDocument,
  '\n  query AppSyncs($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        syncs(first: 40) {\n          commitAuthor\n          commitHash\n          commitMessage\n          commitRef\n          framework\n          id\n          lastSyncedAt\n          platform\n          removedFunctions {\n            id\n            name\n            slug\n          }\n          repoURL\n          sdkLanguage\n          sdkVersion\n          status\n          syncedFunctions: deployedFunctions {\n            id\n            name\n            slug\n          }\n          url\n          vercelDeploymentID\n          vercelDeploymentURL\n          vercelProjectID\n          vercelProjectURL\n        }\n      }\n    }\n  }\n':
    types.AppSyncsDocument,
  '\n  query App($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        externalID\n        functions {\n          id\n          latestVersion {\n            triggers {\n              eventName\n              schedule\n            }\n          }\n          name\n          slug\n        }\n        name\n        method\n        latestSync {\n          commitAuthor\n          commitHash\n          commitMessage\n          commitRef\n          error\n          framework\n          id\n          lastSyncedAt\n          platform\n          repoURL\n          sdkLanguage\n          sdkVersion\n          status\n          url\n          vercelDeploymentID\n          vercelDeploymentURL\n          vercelProjectID\n          vercelProjectURL\n        }\n      }\n    }\n  }\n':
    types.AppDocument,
  '\n  query AppNavData($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        isArchived\n        isParentArchived\n        latestSync {\n          platform\n          url\n        }\n        name\n      }\n    }\n  }\n':
    types.AppNavDataDocument,
  '\n  mutation SyncNewApp($appURL: String!, $envID: UUID!) {\n    syncNewApp(appURL: $appURL, envID: $envID) {\n      app {\n        externalID\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n':
    types.SyncNewAppDocument,
  '\n  query Apps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      apps {\n        id\n        externalID\n        functionCount\n        isArchived\n        name\n        method\n        isParentArchived\n        latestSync {\n          error\n          framework\n          id\n          lastSyncedAt\n          platform\n          sdkLanguage\n          sdkVersion\n          status\n          url\n        }\n        functions {\n          id\n          name\n          slug\n          triggers {\n            eventName\n            schedule\n          }\n        }\n      }\n    }\n  }\n':
    types.AppsDocument,
  '\n  query LatestUnattachedSync($envID: ID!) {\n    environment: workspace(id: $envID) {\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n      }\n    }\n  }\n':
    types.LatestUnattachedSyncDocument,
  '\n  query GetHistoryItemOutput($envID: ID!, $functionID: ID!, $historyItemID: ULID!, $runID: ULID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $functionID) {\n        run(id: $runID) {\n          historyItemOutput(id: $historyItemID)\n        }\n      }\n    }\n  }\n':
    types.GetHistoryItemOutputDocument,
  '\n  query SearchEvents($environmentID: ID!, $lowerTime: Time!, $query: String!, $upperTime: Time!) {\n    environment: workspace(id: $environmentID) {\n      id\n      eventSearch(filter: { lowerTime: $lowerTime, query: $query, upperTime: $upperTime }) {\n        edges {\n          node {\n            id\n            name\n            receivedAt\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n':
    types.SearchEventsDocument,
  '\n  query GetEventSearchEvent($envID: ID!, $eventID: ULID!) {\n    environment: workspace(id: $envID) {\n      event: archivedEvent(id: $eventID) {\n        id\n        name\n        payload: event\n        receivedAt\n        runs: functionRuns {\n          function {\n            id\n            name\n          }\n          id\n          output\n          status\n        }\n      }\n    }\n  }\n':
    types.GetEventSearchEventDocument,
  '\n  query GetEventSearchRun($envID: ID!, $functionID: ID!, $runID: ULID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $functionID) {\n        name\n        run(id: $runID) {\n          canRerun\n          history {\n            attempt\n            cancel {\n              eventID\n              expression\n              userID\n            }\n            createdAt\n            functionVersion\n            groupID\n            id\n            sleep {\n              until\n            }\n            stepName\n            type\n            url\n            waitForEvent {\n              eventName\n              expression\n              timeout\n            }\n            waitResult {\n              eventID\n              timeout\n            }\n          }\n          id\n          status\n          startedAt\n          endedAt\n          output\n          version: workflowVersion {\n            deploy {\n              id\n              createdAt\n            }\n            triggers {\n              eventName\n              schedule\n            }\n            url\n            validFrom\n            version\n          }\n        }\n      }\n    }\n  }\n':
    types.GetEventSearchRunDocument,
  '\n  query GetEventLog($environmentID: ID!, $eventName: String!, $cursor: String, $perPage: Int!) {\n    environment: workspace(id: $environmentID) {\n      eventType: event(name: $eventName) {\n        events: recent @cursored(cursor: $cursor, perPage: $perPage) {\n          id\n          receivedAt\n        }\n      }\n    }\n  }\n':
    types.GetEventLogDocument,
  '\n  fragment EventPayload on ArchivedEvent {\n    payload: event\n  }\n':
    types.EventPayloadFragmentDoc,
  '\n  query GetFunctionNameSlug($environmentID: ID!, $functionID: ID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        name\n        slug\n      }\n    }\n  }\n':
    types.GetFunctionNameSlugDocument,
  '\n  query GetFunctionRunCard($environmentID: ID!, $functionID: ID!, $functionRunID: ULID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        name\n        slug\n        run(id: $functionRunID) {\n          id\n          status\n          startedAt\n        }\n      }\n    }\n  }\n':
    types.GetFunctionRunCardDocument,
  '\n  query GetEvent($environmentID: ID!, $eventID: ULID!) {\n    environment: workspace(id: $environmentID) {\n      event: archivedEvent(id: $eventID) {\n        receivedAt\n        ...EventPayload\n        functionRuns {\n          id\n          function {\n            id\n          }\n        }\n        skippedFunctionRuns {\n          id\n          skipReason\n          workflowID\n          skippedAt\n        }\n      }\n    }\n  }\n':
    types.GetEventDocument,
  '\n  query GetAccountEntitlements {\n    account {\n      entitlements {\n        history {\n          limit\n        }\n      }\n    }\n  }\n':
    types.GetAccountEntitlementsDocument,
  '\n  query GetFunctionRateLimitDocument(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        ratelimit: metrics(\n          opts: { name: "function_run_rate_limited_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFunctionRateLimitDocumentDocument,
  '\n  query GetFunctionRunsMetrics(\n    $environmentID: ID!\n    $functionSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        completed: usage(opts: { from: $startTime, to: $endTime }, event: "completed") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        canceled: usage(opts: { from: $startTime, to: $endTime }, event: "cancelled") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        failed: usage(opts: { from: $startTime, to: $endTime }, event: "errored") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFunctionRunsMetricsDocument,
  '\n  query GetFnMetrics($environmentID: ID!, $fnSlug: String!, $startTime: Time!, $endTime: Time!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        queued: metrics(\n          opts: { name: "function_run_scheduled_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        started: metrics(\n          opts: { name: "function_run_started_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        ended: metrics(opts: { name: "function_run_ended_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFnMetricsDocument,
  '\n  query GetFailedFunctionRuns(\n    $environmentID: ID!\n    $functionSlug: String!\n    $lowerTime: Time!\n    $upperTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        failedRuns: runsV2(\n          filter: {\n            lowerTime: $lowerTime\n            status: [FAILED]\n            timeField: ENDED_AT\n            upperTime: $upperTime\n          }\n          first: 20\n        ) {\n          edges {\n            node {\n              id\n              endedAt\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFailedFunctionRunsDocument,
  '\n  query GetSDKRequestMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        queued: metrics(opts: { name: "sdk_req_scheduled_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        started: metrics(opts: { name: "sdk_req_started_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n\n        ended: metrics(opts: { name: "sdk_req_ended_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n':
    types.GetSdkRequestMetricsDocument,
  '\n  query GetStepBacklogMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        scheduled: metrics(opts: { name: "steps_scheduled", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        sleeping: metrics(opts: { name: "steps_sleeping", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n':
    types.GetStepBacklogMetricsDocument,
  '\n  query GetStepsRunningMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        running: metrics(opts: { name: "steps_running", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n\n        concurrencyLimit: metrics(\n          opts: { name: "concurrency_limit_reached_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n':
    types.GetStepsRunningMetricsDocument,
  '\n  mutation DeleteCancellation($envID: UUID!, $cancellationID: ULID!) {\n    deleteCancellation(envID: $envID, cancellationID: $cancellationID)\n  }\n':
    types.DeleteCancellationDocument,
  '\n  query GetFnCancellations($after: String, $envSlug: String!, $fnSlug: String!) {\n    env: envBySlug(slug: $envSlug) {\n      fn: workflowBySlug(slug: $fnSlug) {\n        cancellations(after: $after) {\n          edges {\n            cursor\n            node {\n              createdAt\n              envID: environmentID\n              id\n              name\n              queuedAtMax\n              queuedAtMin\n            }\n          }\n          pageInfo {\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFnCancellationsDocument,
  '\n  mutation InvokeFunction($envID: UUID!, $data: Map, $functionSlug: String!, $user: Map) {\n    invokeFunction(envID: $envID, data: $data, functionSlug: $functionSlug, user: $user)\n  }\n':
    types.InvokeFunctionDocument,
  '\n  query GetReplays($environmentID: ID!, $functionSlug: String!) {\n    environment: workspace(id: $environmentID) {\n      id\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        replays {\n          id\n          name\n          createdAt\n          endedAt\n          functionRunsScheduledCount\n        }\n      }\n    }\n  }\n':
    types.GetReplaysDocument,
  '\n  query GetFunctionPauseState($environmentID: ID!, $functionSlug: String!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        isPaused\n      }\n    }\n  }\n':
    types.GetFunctionPauseStateDocument,
  '\n  mutation NewIngestKey($input: NewIngestKey!) {\n    key: createIngestKey(input: $input) {\n      id\n    }\n  }\n':
    types.NewIngestKeyDocument,
  '\n  query GetIngestKeys($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKeys {\n        id\n        name\n        createdAt\n        source\n      }\n    }\n  }\n':
    types.GetIngestKeysDocument,
  '\n  mutation UpdateIngestKey($id: ID!, $input: UpdateIngestKey!) {\n    updateIngestKey(id: $id, input: $input) {\n      id\n      name\n      createdAt\n      presharedKey\n      url\n      filter {\n        type\n        ips\n        events\n      }\n      metadata\n    }\n  }\n':
    types.UpdateIngestKeyDocument,
  '\n  mutation DeleteEventKey($input: DeleteIngestKey!) {\n    deleteIngestKey(input: $input) {\n      ids\n    }\n  }\n':
    types.DeleteEventKeyDocument,
  '\n  query GetIngestKey($environmentID: ID!, $keyID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKey(id: $keyID) {\n        id\n        name\n        createdAt\n        presharedKey\n        url\n        filter {\n          type\n          ips\n          events\n        }\n        metadata\n        source\n      }\n    }\n  }\n':
    types.GetIngestKeyDocument,
  '\n  mutation CreateSigningKey($envID: UUID!) {\n    createSigningKey(envID: $envID) {\n      createdAt\n    }\n  }\n':
    types.CreateSigningKeyDocument,
  '\n  mutation DeleteSigningKey($signingKeyID: UUID!) {\n    deleteSigningKey(id: $signingKeyID) {\n      createdAt\n    }\n  }\n':
    types.DeleteSigningKeyDocument,
  '\n  mutation RotateSigningKey($envID: UUID!) {\n    rotateSigningKey(envID: $envID) {\n      createdAt\n    }\n  }\n':
    types.RotateSigningKeyDocument,
  '\n  query GetSigningKeys($envID: ID!) {\n    environment: workspace(id: $envID) {\n      signingKeys {\n        createdAt\n        decryptedValue\n        id\n        isActive\n        user {\n          email\n          name\n        }\n      }\n    }\n  }\n':
    types.GetSigningKeysDocument,
  '\n  query UnattachedSync($syncID: ID!) {\n    sync: deploy(id: $syncID) {\n      commitAuthor\n      commitHash\n      commitMessage\n      commitRef\n      error\n      framework\n      id\n      lastSyncedAt\n      platform\n      repoURL\n      sdkLanguage\n      sdkVersion\n      status\n      removedFunctions: removedFunctions {\n        id\n        name\n        slug\n      }\n      syncedFunctions: deployedFunctions {\n        id\n        name\n        slug\n      }\n      url\n      vercelDeploymentID\n      vercelDeploymentURL\n      vercelProjectID\n      vercelProjectURL\n    }\n  }\n':
    types.UnattachedSyncDocument,
  '\n  query UnattachedSyncs($envID: ID!) {\n    environment: workspace(id: $envID) {\n      syncs: unattachedSyncs(first: 40) {\n        commitAuthor\n        commitHash\n        commitMessage\n        commitRef\n        framework\n        id\n        lastSyncedAt\n        platform\n        repoURL\n        sdkLanguage\n        sdkVersion\n        status\n        url\n        vercelDeploymentID\n        vercelDeploymentURL\n        vercelProjectID\n        vercelProjectURL\n      }\n    }\n  }\n':
    types.UnattachedSyncsDocument,
  '\n  query VercelIntegration {\n    account {\n      vercelIntegration {\n        isMarketplace\n        projects {\n          canChangeEnabled\n          deploymentProtection\n          isEnabled\n          name\n          originOverride\n          projectID\n          protectionBypassSecret\n          servePath\n        }\n      }\n    }\n  }\n':
    types.VercelIntegrationDocument,
  '\n  query GetSavedVercelProjects($environmentID: ID!) {\n    account {\n      marketplace\n    }\n\n    environment: workspace(id: $environmentID) {\n      savedVercelProjects: vercelApps {\n        id\n        originOverride\n        projectID\n        protectionBypassSecret\n        path\n        workspaceID\n        originOverride\n        protectionBypassSecret\n      }\n    }\n  }\n':
    types.GetSavedVercelProjectsDocument,
  '\n  mutation CreateVercelApp($input: CreateVercelAppInput!) {\n    createVercelApp(input: $input) {\n      success\n    }\n  }\n':
    types.CreateVercelAppDocument,
  '\n  mutation UpdateVercelApp($input: UpdateVercelAppInput!) {\n    updateVercelApp(input: $input) {\n      success\n    }\n  }\n':
    types.UpdateVercelAppDocument,
  '\n  mutation RemoveVercelApp($input: RemoveVercelAppInput!) {\n    removeVercelApp(input: $input) {\n      success\n    }\n  }\n':
    types.RemoveVercelAppDocument,
  '\n  mutation CreateWebhook($input: NewIngestKey!) {\n    key: createIngestKey(input: $input) {\n      id\n      url\n    }\n  }\n':
    types.CreateWebhookDocument,
  '\n  mutation CompleteAWSMarketplaceSetup($input: AWSMarketplaceSetupInput!) {\n    completeAWSMarketplaceSetup(input: $input) {\n      message\n    }\n  }\n':
    types.CompleteAwsMarketplaceSetupDocument,
  '\n  query GetAccountSupportInfo {\n    account {\n      id\n      plan {\n        id\n        name\n        amount\n        features\n      }\n    }\n  }\n':
    types.GetAccountSupportInfoDocument,
  '\n  query GetArchivedAppBannerData($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        isArchived\n      }\n    }\n  }\n':
    types.GetArchivedAppBannerDataDocument,
  '\n  query GetArchivedFuncBannerData($envID: ID!, $funcID: ID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $funcID) {\n        id\n        archivedAt\n      }\n    }\n  }\n':
    types.GetArchivedFuncBannerDataDocument,
  '\n  mutation UpdateAccountAddonQuantity($addonName: String!, $quantity: Int!) {\n    updateAccountAddonQuantity(addonName: $addonName, quantity: $quantity) {\n      purchaseCount\n    }\n  }\n':
    types.UpdateAccountAddonQuantityDocument,
  '\n  mutation UpdateAccount($input: UpdateAccount!) {\n    account: updateAccount(input: $input) {\n      billingEmail\n      name\n    }\n  }\n':
    types.UpdateAccountDocument,
  '\n  mutation UpdatePaymentMethod($token: String!) {\n    updatePaymentMethod(token: $token) {\n      brand\n      last4\n      expMonth\n      expYear\n      createdAt\n      default\n    }\n  }\n':
    types.UpdatePaymentMethodDocument,
  '\n  query GetPaymentIntents {\n    account {\n      paymentIntents {\n        status\n        createdAt\n        amountLabel\n        description\n        invoiceURL\n      }\n    }\n  }\n':
    types.GetPaymentIntentsDocument,
  '\n  mutation CreateStripeSubscription($input: StripeSubscriptionInput!) {\n    createStripeSubscription(input: $input) {\n      clientSecret\n      message\n    }\n  }\n':
    types.CreateStripeSubscriptionDocument,
  '\n  mutation UpdatePlan($planID: ID!) {\n    updatePlan(to: $planID) {\n      plan {\n        id\n        name\n      }\n    }\n  }\n':
    types.UpdatePlanDocument,
  '\n  query GetBillableSteps($month: Int!, $year: Int!) {\n    usage: billableStepTimeSeries(timeOptions: { month: $month, year: $year }) {\n      data {\n        time\n        value\n      }\n    }\n  }\n':
    types.GetBillableStepsDocument,
  '\n  query GetBillableRuns($month: Int!, $year: Int!) {\n    usage: runCountTimeSeries(timeOptions: { month: $month, year: $year }) {\n      data {\n        time\n        value\n      }\n    }\n  }\n':
    types.GetBillableRunsDocument,
  '\n  query EntitlementUsage {\n    account {\n      id\n      addons {\n        concurrency {\n          available\n          baseValue\n          maxValue\n          name\n          price\n          purchaseCount\n          quantityPer\n        }\n        userCount {\n          available\n          baseValue\n          maxValue\n          name\n          price\n          purchaseCount\n          quantityPer\n        }\n      }\n      entitlements {\n        runCount {\n          usage\n          limit\n          overageAllowed\n        }\n        stepCount {\n          usage\n          limit\n          overageAllowed\n        }\n        concurrency {\n          usage\n          limit\n        }\n        eventSize {\n          limit\n        }\n        history {\n          limit\n        }\n        userCount {\n          usage\n          limit\n        }\n        hipaa {\n          enabled\n        }\n        metricsExport {\n          enabled\n        }\n        metricsExportFreshness {\n          limit\n        }\n        metricsExportGranularity {\n          limit\n        }\n      }\n      plan {\n        name\n      }\n    }\n  }\n':
    types.EntitlementUsageDocument,
  '\n  query GetCurrentPlan {\n    account {\n      plan {\n        id\n        name\n        amount\n        billingPeriod\n        entitlements {\n          concurrency {\n            limit\n          }\n          eventSize {\n            limit\n          }\n          history {\n            limit\n          }\n          runCount {\n            limit\n          }\n          stepCount {\n            limit\n          }\n          userCount {\n            limit\n          }\n        }\n        addons {\n          concurrency {\n            available\n            price\n            purchaseCount\n            quantityPer\n          }\n          userCount {\n            available\n            price\n            purchaseCount\n            quantityPer\n          }\n        }\n      }\n      subscription {\n        nextInvoiceDate\n      }\n    }\n  }\n':
    types.GetCurrentPlanDocument,
  '\n  query GetBillingDetails {\n    account {\n      billingEmail\n      name\n      paymentMethods {\n        brand\n        last4\n        expMonth\n        expYear\n        createdAt\n        default\n      }\n    }\n  }\n':
    types.GetBillingDetailsDocument,
  '\n  query GetPlans {\n    plans {\n      id\n      name\n      amount\n      billingPeriod\n      entitlements {\n        concurrency {\n          limit\n        }\n        eventSize {\n          limit\n        }\n        history {\n          limit\n        }\n        runCount {\n          limit\n        }\n        stepCount {\n          limit\n        }\n      }\n    }\n  }\n':
    types.GetPlansDocument,
  '\n  mutation ArchiveEnvironment($id: ID!) {\n    archiveEnvironment(id: $id) {\n      id\n    }\n  }\n':
    types.ArchiveEnvironmentDocument,
  '\n  mutation UnarchiveEnvironment($id: ID!) {\n    unarchiveEnvironment(id: $id) {\n      id\n    }\n  }\n':
    types.UnarchiveEnvironmentDocument,
  '\n  mutation DisableEnvironmentAutoArchiveDocument($id: ID!) {\n    disableEnvironmentAutoArchive(id: $id) {\n      id\n    }\n  }\n':
    types.DisableEnvironmentAutoArchiveDocumentDocument,
  '\n  mutation EnableEnvironmentAutoArchive($id: ID!) {\n    enableEnvironmentAutoArchive(id: $id) {\n      id\n    }\n  }\n':
    types.EnableEnvironmentAutoArchiveDocument,
  '\n  mutation ArchiveEvent($environmentId: ID!, $name: String!) {\n    archiveEvent(workspaceID: $environmentId, name: $name) {\n      name\n    }\n  }\n':
    types.ArchiveEventDocument,
  '\n  query GetLatestEventLogs($name: String, $environmentID: ID!) {\n    events(query: { name: $name, workspaceID: $environmentID }) {\n      data {\n        recent(count: 5) {\n          id\n          receivedAt\n          event\n          source {\n            name\n          }\n        }\n      }\n    }\n  }\n':
    types.GetLatestEventLogsDocument,
  '\n  query GetEventKeys($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      eventKeys: ingestKeys {\n        name\n        value: presharedKey\n      }\n    }\n  }\n':
    types.GetEventKeysDocument,
  '\n  mutation CreateCancellation($input: CreateCancellationInput!) {\n    createCancellation(input: $input) {\n      id\n    }\n  }\n':
    types.CreateCancellationDocument,
  '\n  query GetCancellationRunCount(\n    $envID: ID!\n    $functionSlug: String!\n    $queuedAtMin: Time\n    $queuedAtMax: Time!\n  ) {\n    environment: workspace(id: $envID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        cancellationRunCount(input: { queuedAtMin: $queuedAtMin, queuedAtMax: $queuedAtMax })\n      }\n    }\n  }\n':
    types.GetCancellationRunCountDocument,
  '\n  mutation PauseFunction($fnID: ID!, $cancelRunning: Boolean) {\n    pauseFunction(fnID: $fnID, cancelRunning: $cancelRunning) {\n      id\n    }\n  }\n':
    types.PauseFunctionDocument,
  '\n  mutation UnpauseFunction($fnID: ID!) {\n    unpauseFunction(fnID: $fnID) {\n      id\n    }\n  }\n':
    types.UnpauseFunctionDocument,
  '\n  query MetricsLookups($envSlug: String!, $page: Int, $pageSize: Int) {\n    envBySlug(slug: $envSlug) {\n      apps {\n        externalID\n        id\n        name\n        isArchived\n      }\n      workflows @paginated(perPage: $pageSize, page: $page) {\n        data {\n          name\n          id\n          slug\n        }\n        page {\n          page\n          totalPages\n          perPage\n        }\n      }\n    }\n  }\n':
    types.MetricsLookupsDocument,
  '\n  query AccountConcurrencyLookup {\n    account {\n      entitlements {\n        concurrency {\n          limit\n        }\n      }\n    }\n  }\n':
    types.AccountConcurrencyLookupDocument,
  '\n  query FunctionStatusMetrics(\n    $workspaceId: ID!\n    $from: Time!\n    $functionIDs: [UUID!]\n    $appIDs: [UUID!]\n    $until: Time\n    $scope: MetricsScope!\n  ) {\n    workspace(id: $workspaceId) {\n      scheduled: scopedMetrics(\n        filter: {\n          name: "function_run_scheduled_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      started: scopedMetrics(\n        filter: {\n          name: "function_run_started_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      completed: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: $scope\n          groupBy: "status"\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      completedByFunction: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: FN\n          groupBy: "status"\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      totals: scopedFunctionStatus(\n        filter: {\n          name: "function_run_scheduled_total"\n          scope: FN\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        queued\n        running\n        completed\n        failed\n        cancelled\n        cancelled\n        skipped\n      }\n    }\n  }\n':
    types.FunctionStatusMetricsDocument,
  '\n  query VolumeMetrics(\n    $workspaceId: ID!\n    $from: Time!\n    $functionIDs: [UUID!]\n    $appIDs: [UUID!]\n    $until: Time\n    $scope: MetricsScope!\n  ) {\n    workspace(id: $workspaceId) {\n      runsThroughput: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputEnded: scopedMetrics(\n        filter: {\n          name: "sdk_req_ended_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputStarted: scopedMetrics(\n        filter: {\n          name: "sdk_req_started_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputScheduled: scopedMetrics(\n        filter: {\n          name: "sdk_req_scheduled_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      stepThroughput: scopedMetrics(\n        filter: {\n          name: "steps_running"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      backlog: scopedMetrics(\n        filter: {\n          name: "steps_scheduled"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      stepRunning: scopedMetrics(\n        filter: {\n          name: "steps_running"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      concurrency: scopedMetrics(\n        filter: {\n          name: "concurrency_limit_reached_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n  }\n':
    types.VolumeMetricsDocument,
  '\n  query QuickSearch($term: String!, $envSlug: String!) {\n    account {\n      quickSearch(term: $term, envSlug: $envSlug) {\n        apps {\n          name\n        }\n        event {\n          id\n          name\n        }\n        eventTypes {\n          name\n        }\n        functions {\n          name\n          slug\n        }\n        run {\n          id\n        }\n      }\n    }\n  }\n':
    types.QuickSearchDocument,
  '\n  query GetGlobalSearch($opts: SearchInput!) {\n    account {\n      search(opts: $opts) {\n        results {\n          env {\n            name\n            id\n            type\n            slug\n          }\n          kind\n          value {\n            ... on ArchivedEvent {\n              id\n              name\n            }\n            ... on FunctionRun {\n              id\n              functionID: workflowID\n              startedAt\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetGlobalSearchDocument,
  '\n  query GetFunctionSlug($environmentID: ID!, $functionID: ID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        slug\n        name\n      }\n    }\n  }\n':
    types.GetFunctionSlugDocument,
  '\n  mutation SyncOnboardingApp($appURL: String!, $envID: UUID!) {\n    syncNewApp(appURL: $appURL, envID: $envID) {\n      app {\n        externalID\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n':
    types.SyncOnboardingAppDocument,
  '\n  mutation InvokeFunctionOnboarding($envID: UUID!, $data: Map, $functionSlug: String!, $user: Map) {\n    invokeFunction(envID: $envID, data: $data, functionSlug: $functionSlug, user: $user)\n  }\n':
    types.InvokeFunctionOnboardingDocument,
  '\n  query InvokeFunctionLookup($envSlug: String!, $page: Int, $pageSize: Int) {\n    envBySlug(slug: $envSlug) {\n      workflows @paginated(perPage: $pageSize, page: $page) {\n        data {\n          name\n          id\n          slug\n          current {\n            triggers {\n              eventName\n            }\n          }\n        }\n        page {\n          page\n          totalPages\n          perPage\n        }\n      }\n    }\n  }\n':
    types.InvokeFunctionLookupDocument,
  '\n  query GetVercelApps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n        error\n        url\n        vercelDeploymentURL\n      }\n      apps {\n        id\n        name\n        externalID\n        isArchived\n        latestSync {\n          error\n          id\n          platform\n          vercelDeploymentID\n          vercelProjectID\n          status\n        }\n      }\n    }\n  }\n':
    types.GetVercelAppsDocument,
  '\n  query ProductionApps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      apps {\n        id\n      }\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n      }\n    }\n  }\n':
    types.ProductionAppsDocument,
  '\n  query getPostgresIntegrations($envID: ID!) {\n    environment: workspace(id: $envID) {\n      cdcConnections {\n        id\n        name\n        status\n        statusDetail\n        description\n      }\n    }\n  }\n':
    types.GetPostgresIntegrationsDocument,
  '\n  mutation testCredentials($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcTestCredentials(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n':
    types.TestCredentialsDocument,
  '\n  mutation testReplication($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcTestLogicalReplication(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n':
    types.TestReplicationDocument,
  '\n  mutation testAutoSetup($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcAutoSetup(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n':
    types.TestAutoSetupDocument,
  '\n  mutation cdcDelete($envID: UUID!, $id: UUID!) {\n    cdcDelete(envID: $envID, id: $id) {\n      ids\n    }\n  }\n':
    types.CdcDeleteDocument,
  '\n  query MetricsEntitlements {\n    account {\n      id\n      entitlements {\n        metricsExport {\n          enabled\n        }\n        metricsExportFreshness {\n          limit\n        }\n        metricsExportGranularity {\n          limit\n        }\n      }\n    }\n  }\n':
    types.MetricsEntitlementsDocument,
  '\n  query GetReplayRunCounts($environmentID: ID!, $functionSlug: String!, $from: Time!, $to: Time!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        replayCounts: replayCounts(from: $from, to: $to) {\n          completedCount\n          failedCount\n          cancelledCount\n          skippedPausedCount\n        }\n      }\n    }\n  }\n':
    types.GetReplayRunCountsDocument,
  '\n  mutation CreateFunctionReplay(\n    $environmentID: UUID!\n    $functionID: UUID!\n    $name: String!\n    $fromRange: ULID!\n    $toRange: ULID!\n    $statuses: [ReplayRunStatus!]\n  ) {\n    createFunctionReplay(\n      input: {\n        workspaceID: $environmentID\n        workflowID: $functionID\n        name: $name\n        fromRange: $fromRange\n        toRange: $toRange\n        statusesV2: $statuses\n      }\n    ) {\n      id\n    }\n  }\n':
    types.CreateFunctionReplayDocument,
  '\n  fragment TraceDetails on RunTraceSpan {\n    name\n    status\n    attempts\n    queuedAt\n    startedAt\n    endedAt\n    isRoot\n    outputID\n    stepID\n    spanID\n    stepOp\n    stepInfo {\n      __typename\n      ... on InvokeStepInfo {\n        triggeringEventID\n        functionID\n        timeout\n        returnEventID\n        runID\n        timedOut\n      }\n      ... on SleepStepInfo {\n        sleepUntil\n      }\n      ... on WaitForEventStepInfo {\n        eventName\n        expression\n        timeout\n        foundEventID\n        timedOut\n      }\n    }\n  }\n':
    types.TraceDetailsFragmentDoc,
  '\n  query GetRunTrace($envID: ID!, $runID: String!) {\n    workspace(id: $envID) {\n      run(runID: $runID) {\n        function {\n          app {\n            name\n            externalID\n          }\n          id\n          name\n          slug\n        }\n        trace {\n          ...TraceDetails\n          childrenSpans {\n            ...TraceDetails\n            childrenSpans {\n              ...TraceDetails\n            }\n          }\n        }\n        hasAI\n      }\n    }\n  }\n':
    types.GetRunTraceDocument,
  '\n  query TraceResult($envID: ID!, $traceID: String!) {\n    workspace(id: $envID) {\n      runTraceSpanOutputByID(outputID: $traceID) {\n        data\n        input\n        error {\n          message\n          name\n          stack\n        }\n      }\n    }\n  }\n':
    types.TraceResultDocument,
  '\n  query GetRunTraceTrigger($envID: ID!, $runID: String!) {\n    workspace(id: $envID) {\n      runTrigger(runID: $runID) {\n        IDs\n        payloads\n        timestamp\n        eventName\n        isBatch\n        batchID\n        cron\n      }\n    }\n  }\n':
    types.GetRunTraceTriggerDocument,
  '\n  query GetRuns(\n    $appIDs: [UUID!]\n    $environmentID: ID!\n    $startTime: Time!\n    $endTime: Time\n    $status: [FunctionRunStatus!]\n    $timeField: RunsOrderByField!\n    $functionSlug: String\n    $functionRunCursor: String = null\n    $celQuery: String = null\n  ) {\n    environment: workspace(id: $environmentID) {\n      runs(\n        filter: {\n          appIDs: $appIDs\n          from: $startTime\n          until: $endTime\n          status: $status\n          timeField: $timeField\n          fnSlug: $functionSlug\n          query: $celQuery\n        }\n        orderBy: [{ field: $timeField, direction: DESC }]\n        after: $functionRunCursor\n      ) {\n        edges {\n          node {\n            app {\n              externalID\n              name\n            }\n            cronSchedule\n            eventName\n            function {\n              name\n              slug\n            }\n            id\n            isBatch\n            queuedAt\n            endedAt\n            startedAt\n            status\n            hasAI\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n':
    types.GetRunsDocument,
  '\n  query CountRuns(\n    $appIDs: [UUID!]\n    $environmentID: ID!\n    $startTime: Time!\n    $endTime: Time\n    $status: [FunctionRunStatus!]\n    $timeField: RunsOrderByField!\n    $functionSlug: String\n    $celQuery: String = null\n  ) {\n    environment: workspace(id: $environmentID) {\n      runs(\n        filter: {\n          appIDs: $appIDs\n          from: $startTime\n          until: $endTime\n          status: $status\n          timeField: $timeField\n          fnSlug: $functionSlug\n          query: $celQuery\n        }\n        orderBy: [{ field: $timeField, direction: DESC }]\n      ) {\n        totalCount\n      }\n    }\n  }\n':
    types.CountRunsDocument,
  '\n  query AppFilter($envSlug: String!) {\n    env: envBySlug(slug: $envSlug) {\n      apps {\n        externalID\n        id\n        name\n      }\n    }\n  }\n':
    types.AppFilterDocument,
  '\n  query GetWorkerConnections(\n    $envID: ID!\n    $appID: UUID!\n    $startTime: Time!\n    $status: [ConnectV1ConnectionStatus!]\n    $timeField: ConnectV1WorkerConnectionsOrderByField!\n    $cursor: String = null\n    $orderBy: [ConnectV1WorkerConnectionsOrderBy!] = []\n    $first: Int!\n  ) {\n    environment: workspace(id: $envID) {\n      workerConnections(\n        first: $first\n        filter: { appIDs: [$appID], from: $startTime, status: $status, timeField: $timeField }\n        orderBy: $orderBy\n        after: $cursor\n      ) {\n        edges {\n          node {\n            id\n            gatewayId\n            instanceID: instanceId\n            workerIp\n            app {\n              id\n            }\n            connectedAt\n            lastHeartbeatAt\n            disconnectedAt\n            disconnectReason\n            status\n            sdkLang\n            sdkVersion\n            sdkPlatform\n            appVersion: buildId\n            functionCount\n            cpuCores\n            memBytes\n            os\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n':
    types.GetWorkerConnectionsDocument,
  '\n  query GetWorkerCountConnections(\n    $envID: ID!\n    $appID: UUID!\n    $startTime: Time!\n    $status: [ConnectV1ConnectionStatus!] = []\n    $timeField: ConnectV1WorkerConnectionsOrderByField!\n  ) {\n    environment: workspace(id: $envID) {\n      workerConnections(\n        filter: { appIDs: [$appID], from: $startTime, status: $status, timeField: $timeField }\n        orderBy: [{ field: $timeField, direction: DESC }]\n      ) {\n        totalCount\n      }\n    }\n  }\n':
    types.GetWorkerCountConnectionsDocument,
  '\n  query GetDeployss($environmentID: ID!) {\n    deploys(workspaceID: $environmentID) {\n      id\n      appName\n      authorID\n      checksum\n      createdAt\n      error\n      framework\n      metadata\n      sdkLanguage\n      sdkVersion\n      status\n\n      deployedFunctions {\n        id\n        name\n      }\n\n      removedFunctions {\n        id\n        name\n      }\n    }\n  }\n':
    types.GetDeployssDocument,
  '\n  query GetEnvironments {\n    workspaces {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      webhookSigningKey\n      createdAt\n      isArchived\n      isAutoArchiveEnabled\n      lastDeployedAt\n    }\n  }\n':
    types.GetEnvironmentsDocument,
  '\n  query GetEnvironmentBySlug($slug: String!) {\n    envBySlug(slug: $slug) {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n      webhookSigningKey\n    }\n  }\n':
    types.GetEnvironmentBySlugDocument,
  '\n  query GetDefaultEnvironment {\n    defaultEnv {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n    }\n  }\n':
    types.GetDefaultEnvironmentDocument,
  '\n  query GetEventTypes($environmentID: ID!, $page: Int) {\n    workspace(id: $environmentID) {\n      events @paginated(perPage: 50, page: $page) {\n        data {\n          name\n          functions: workflows {\n            id\n            slug\n            name\n          }\n        }\n        page {\n          page\n          totalPages\n        }\n      }\n    }\n  }\n':
    types.GetEventTypesDocument,
  '\n  query GetEventTypesVolume($environmentID: ID!, $page: Int) {\n    workspace(id: $environmentID) {\n      events @paginated(perPage: 50, page: $page) {\n        data {\n          name\n          dailyVolume: usage(opts: { period: "hour", range: "day" }) {\n            total\n            data {\n              count\n            }\n          }\n        }\n        page {\n          page\n          totalPages\n        }\n      }\n    }\n  }\n':
    types.GetEventTypesVolumeDocument,
  '\n  query GetEventType($eventName: String, $environmentID: ID!) {\n    events(query: { name: $eventName, workspaceID: $environmentID }) {\n      data {\n        name\n        usage(opts: { period: "hour", range: "day" }) {\n          total\n          data {\n            slot\n            count\n          }\n        }\n        workflows {\n          id\n          slug\n          name\n          current {\n            createdAt\n          }\n        }\n      }\n    }\n  }\n':
    types.GetEventTypeDocument,
  '\n  query GetFunctionsUsage($environmentID: ID!, $page: Int, $archived: Boolean, $pageSize: Int) {\n    workspace(id: $environmentID) {\n      workflows(archived: $archived) @paginated(perPage: $pageSize, page: $page) {\n        page {\n          page\n          perPage\n          totalItems\n          totalPages\n        }\n        data {\n          id\n          slug\n          dailyStarts: usage(opts: { period: "hour", range: "day" }, event: "started") {\n            total\n            data {\n              count\n            }\n          }\n          dailyCompleted: usage(opts: { period: "hour", range: "day" }, event: "completed") {\n            total\n            data {\n              count\n            }\n          }\n          dailyCancelled: usage(opts: { period: "hour", range: "day" }, event: "cancelled") {\n            total\n            data {\n              count\n            }\n          }\n          dailyFailures: usage(opts: { period: "hour", range: "day" }, event: "errored") {\n            total\n            data {\n              count\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFunctionsUsageDocument,
  '\n  query GetFunctions(\n    $environmentID: ID!\n    $page: Int\n    $archived: Boolean\n    $search: String\n    $pageSize: Int\n  ) {\n    workspace(id: $environmentID) {\n      workflows(archived: $archived, search: $search) @paginated(perPage: $pageSize, page: $page) {\n        page {\n          page\n          perPage\n          totalItems\n          totalPages\n        }\n        data {\n          appName\n          id\n          slug\n          name\n          isPaused\n          isArchived\n          current {\n            triggers {\n              eventName\n              schedule\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFunctionsDocument,
  '\n  query GetFunction($slug: String!, $environmentID: ID!) {\n    workspace(id: $environmentID) {\n      id\n      workflow: workflowBySlug(slug: $slug) {\n        id\n        name\n        slug\n        isPaused\n        isArchived\n        appName\n        current {\n          triggers {\n            eventName\n            schedule\n            condition\n          }\n          deploy {\n            id\n            createdAt\n          }\n        }\n        failureHandler {\n          slug\n          name\n        }\n        configuration {\n          cancellations {\n            event\n            timeout\n            condition\n          }\n          retries {\n            value\n            isDefault\n          }\n          priority\n          eventsBatch {\n            maxSize\n            timeout\n            key\n          }\n          concurrency {\n            scope\n            limit {\n              value\n              isPlanLimit\n            }\n            key\n          }\n          rateLimit {\n            limit\n            period\n            key\n          }\n          debounce {\n            period\n            key\n          }\n          throttle {\n            burst\n            key\n            limit\n            period\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFunctionDocument,
  '\n  query GetFunctionUsage($id: ID!, $environmentID: ID!, $startTime: Time!, $endTime: Time!) {\n    workspace(id: $environmentID) {\n      workflow(id: $id) {\n        dailyStarts: usage(opts: { from: $startTime, to: $endTime }, event: "started") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyCancelled: usage(opts: { from: $startTime, to: $endTime }, event: "cancelled") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyCompleted: usage(opts: { from: $startTime, to: $endTime }, event: "completed") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyFailures: usage(opts: { from: $startTime, to: $endTime }, event: "errored") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n      }\n    }\n  }\n':
    types.GetFunctionUsageDocument,
  '\n  query GetProductionWorkspace {\n    defaultEnv {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n      webhookSigningKey\n    }\n  }\n':
    types.GetProductionWorkspaceDocument,
  '\n  query Profile {\n    account {\n      name\n      marketplace\n    }\n  }\n':
    types.ProfileDocument,
  '\n  mutation CancelRun($envID: UUID!, $runID: ULID!) {\n    cancelRun(envID: $envID, runID: $runID) {\n      id\n    }\n  }\n':
    types.CancelRunDocument,
  '\n  query GetEventKeysForBlankSlate($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKeys(filter: { source: "key" }) {\n        name\n        presharedKey\n        createdAt\n      }\n    }\n  }\n':
    types.GetEventKeysForBlankSlateDocument,
  '\n  mutation RerunFunctionRun($environmentID: ID!, $functionID: ID!, $functionRunID: ULID!) {\n    retryWorkflowRun(\n      input: { workspaceID: $environmentID, workflowID: $functionID }\n      workflowRunID: $functionRunID\n    ) {\n      id\n    }\n  }\n':
    types.RerunFunctionRunDocument,
  '\n  mutation Rerun($runID: ULID!, $fromStep: RerunFromStepInput) {\n    rerun(runID: $runID, fromStep: $fromStep)\n  }\n':
    types.RerunDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SetUpAccount {\n    setUpAccount {\n      account {\n        id\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation SetUpAccount {\n    setUpAccount {\n      account {\n        id\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateUser {\n    createUser {\n      user {\n        id\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateUser {\n    createUser {\n      user {\n        id\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetBillingInfo {\n    account {\n      entitlements {\n        stepCount {\n          usage\n          limit\n        }\n        runCount {\n          usage\n          limit\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetBillingInfo {\n    account {\n      entitlements {\n        stepCount {\n          usage\n          limit\n        }\n        runCount {\n          usage\n          limit\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateEnvironment($name: String!) {\n    createWorkspace(input: { name: $name }) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateEnvironment($name: String!) {\n    createWorkspace(input: { name: $name }) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation AchiveApp($appID: UUID!) {\n    archiveApp(id: $appID) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation AchiveApp($appID: UUID!) {\n    archiveApp(id: $appID) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UnachiveApp($appID: UUID!) {\n    unarchiveApp(id: $appID) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation UnachiveApp($appID: UUID!) {\n    unarchiveApp(id: $appID) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ResyncApp($appExternalID: String!, $appURL: String, $envID: UUID!) {\n    resyncApp(appExternalID: $appExternalID, appURL: $appURL, envID: $envID) {\n      app {\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation ResyncApp($appExternalID: String!, $appURL: String, $envID: UUID!) {\n    resyncApp(appExternalID: $appExternalID, appURL: $appURL, envID: $envID) {\n      app {\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CheckApp($envID: ID!, $url: String!) {\n    env: workspace(id: $envID) {\n      appCheck(url: $url) {\n        apiOrigin {\n          value\n        }\n        appID {\n          value\n        }\n        authenticationSucceeded {\n          value\n        }\n        env {\n          value\n        }\n        error\n        eventAPIOrigin {\n          value\n        }\n        eventKeyStatus\n        extra\n        framework {\n          value\n        }\n        isReachable\n        isSDK\n        mode\n        respHeaders\n        respStatusCode\n        sdkLanguage {\n          value\n        }\n        sdkVersion {\n          value\n        }\n        serveOrigin {\n          value\n        }\n        servePath {\n          value\n        }\n        signingKeyStatus\n        signingKeyFallbackStatus\n      }\n    }\n  }\n'
): (typeof documents)['\n  query CheckApp($envID: ID!, $url: String!) {\n    env: workspace(id: $envID) {\n      appCheck(url: $url) {\n        apiOrigin {\n          value\n        }\n        appID {\n          value\n        }\n        authenticationSucceeded {\n          value\n        }\n        env {\n          value\n        }\n        error\n        eventAPIOrigin {\n          value\n        }\n        eventKeyStatus\n        extra\n        framework {\n          value\n        }\n        isReachable\n        isSDK\n        mode\n        respHeaders\n        respStatusCode\n        sdkLanguage {\n          value\n        }\n        sdkVersion {\n          value\n        }\n        serveOrigin {\n          value\n        }\n        servePath {\n          value\n        }\n        signingKeyStatus\n        signingKeyFallbackStatus\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Sync($envID: ID!, $externalAppID: String!, $syncID: ID!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        externalID\n        name\n        method\n      }\n    }\n    sync: deploy(id: $syncID) {\n      commitAuthor\n      commitHash\n      commitMessage\n      commitRef\n      error\n      framework\n      id\n      lastSyncedAt\n      platform\n      repoURL\n      sdkLanguage\n      sdkVersion\n      status\n      removedFunctions: removedFunctions {\n        id\n        name\n        slug\n      }\n      syncedFunctions: deployedFunctions {\n        id\n        name\n        slug\n      }\n      url\n      vercelDeploymentID\n      vercelDeploymentURL\n      vercelProjectID\n      vercelProjectURL\n    }\n  }\n'
): (typeof documents)['\n  query Sync($envID: ID!, $externalAppID: String!, $syncID: ID!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        externalID\n        name\n        method\n      }\n    }\n    sync: deploy(id: $syncID) {\n      commitAuthor\n      commitHash\n      commitMessage\n      commitRef\n      error\n      framework\n      id\n      lastSyncedAt\n      platform\n      repoURL\n      sdkLanguage\n      sdkVersion\n      status\n      removedFunctions: removedFunctions {\n        id\n        name\n        slug\n      }\n      syncedFunctions: deployedFunctions {\n        id\n        name\n        slug\n      }\n      url\n      vercelDeploymentID\n      vercelDeploymentURL\n      vercelProjectID\n      vercelProjectURL\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AppSyncs($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        syncs(first: 40) {\n          commitAuthor\n          commitHash\n          commitMessage\n          commitRef\n          framework\n          id\n          lastSyncedAt\n          platform\n          removedFunctions {\n            id\n            name\n            slug\n          }\n          repoURL\n          sdkLanguage\n          sdkVersion\n          status\n          syncedFunctions: deployedFunctions {\n            id\n            name\n            slug\n          }\n          url\n          vercelDeploymentID\n          vercelDeploymentURL\n          vercelProjectID\n          vercelProjectURL\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query AppSyncs($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        syncs(first: 40) {\n          commitAuthor\n          commitHash\n          commitMessage\n          commitRef\n          framework\n          id\n          lastSyncedAt\n          platform\n          removedFunctions {\n            id\n            name\n            slug\n          }\n          repoURL\n          sdkLanguage\n          sdkVersion\n          status\n          syncedFunctions: deployedFunctions {\n            id\n            name\n            slug\n          }\n          url\n          vercelDeploymentID\n          vercelDeploymentURL\n          vercelProjectID\n          vercelProjectURL\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query App($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        externalID\n        functions {\n          id\n          latestVersion {\n            triggers {\n              eventName\n              schedule\n            }\n          }\n          name\n          slug\n        }\n        name\n        method\n        latestSync {\n          commitAuthor\n          commitHash\n          commitMessage\n          commitRef\n          error\n          framework\n          id\n          lastSyncedAt\n          platform\n          repoURL\n          sdkLanguage\n          sdkVersion\n          status\n          url\n          vercelDeploymentID\n          vercelDeploymentURL\n          vercelProjectID\n          vercelProjectURL\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query App($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        externalID\n        functions {\n          id\n          latestVersion {\n            triggers {\n              eventName\n              schedule\n            }\n          }\n          name\n          slug\n        }\n        name\n        method\n        latestSync {\n          commitAuthor\n          commitHash\n          commitMessage\n          commitRef\n          error\n          framework\n          id\n          lastSyncedAt\n          platform\n          repoURL\n          sdkLanguage\n          sdkVersion\n          status\n          url\n          vercelDeploymentID\n          vercelDeploymentURL\n          vercelProjectID\n          vercelProjectURL\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AppNavData($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        isArchived\n        isParentArchived\n        latestSync {\n          platform\n          url\n        }\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  query AppNavData($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        id\n        isArchived\n        isParentArchived\n        latestSync {\n          platform\n          url\n        }\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SyncNewApp($appURL: String!, $envID: UUID!) {\n    syncNewApp(appURL: $appURL, envID: $envID) {\n      app {\n        externalID\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation SyncNewApp($appURL: String!, $envID: UUID!) {\n    syncNewApp(appURL: $appURL, envID: $envID) {\n      app {\n        externalID\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Apps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      apps {\n        id\n        externalID\n        functionCount\n        isArchived\n        name\n        method\n        isParentArchived\n        latestSync {\n          error\n          framework\n          id\n          lastSyncedAt\n          platform\n          sdkLanguage\n          sdkVersion\n          status\n          url\n        }\n        functions {\n          id\n          name\n          slug\n          triggers {\n            eventName\n            schedule\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query Apps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      apps {\n        id\n        externalID\n        functionCount\n        isArchived\n        name\n        method\n        isParentArchived\n        latestSync {\n          error\n          framework\n          id\n          lastSyncedAt\n          platform\n          sdkLanguage\n          sdkVersion\n          status\n          url\n        }\n        functions {\n          id\n          name\n          slug\n          triggers {\n            eventName\n            schedule\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query LatestUnattachedSync($envID: ID!) {\n    environment: workspace(id: $envID) {\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query LatestUnattachedSync($envID: ID!) {\n    environment: workspace(id: $envID) {\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetHistoryItemOutput($envID: ID!, $functionID: ID!, $historyItemID: ULID!, $runID: ULID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $functionID) {\n        run(id: $runID) {\n          historyItemOutput(id: $historyItemID)\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetHistoryItemOutput($envID: ID!, $functionID: ID!, $historyItemID: ULID!, $runID: ULID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $functionID) {\n        run(id: $runID) {\n          historyItemOutput(id: $historyItemID)\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query SearchEvents($environmentID: ID!, $lowerTime: Time!, $query: String!, $upperTime: Time!) {\n    environment: workspace(id: $environmentID) {\n      id\n      eventSearch(filter: { lowerTime: $lowerTime, query: $query, upperTime: $upperTime }) {\n        edges {\n          node {\n            id\n            name\n            receivedAt\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query SearchEvents($environmentID: ID!, $lowerTime: Time!, $query: String!, $upperTime: Time!) {\n    environment: workspace(id: $environmentID) {\n      id\n      eventSearch(filter: { lowerTime: $lowerTime, query: $query, upperTime: $upperTime }) {\n        edges {\n          node {\n            id\n            name\n            receivedAt\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventSearchEvent($envID: ID!, $eventID: ULID!) {\n    environment: workspace(id: $envID) {\n      event: archivedEvent(id: $eventID) {\n        id\n        name\n        payload: event\n        receivedAt\n        runs: functionRuns {\n          function {\n            id\n            name\n          }\n          id\n          output\n          status\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEventSearchEvent($envID: ID!, $eventID: ULID!) {\n    environment: workspace(id: $envID) {\n      event: archivedEvent(id: $eventID) {\n        id\n        name\n        payload: event\n        receivedAt\n        runs: functionRuns {\n          function {\n            id\n            name\n          }\n          id\n          output\n          status\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventSearchRun($envID: ID!, $functionID: ID!, $runID: ULID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $functionID) {\n        name\n        run(id: $runID) {\n          canRerun\n          history {\n            attempt\n            cancel {\n              eventID\n              expression\n              userID\n            }\n            createdAt\n            functionVersion\n            groupID\n            id\n            sleep {\n              until\n            }\n            stepName\n            type\n            url\n            waitForEvent {\n              eventName\n              expression\n              timeout\n            }\n            waitResult {\n              eventID\n              timeout\n            }\n          }\n          id\n          status\n          startedAt\n          endedAt\n          output\n          version: workflowVersion {\n            deploy {\n              id\n              createdAt\n            }\n            triggers {\n              eventName\n              schedule\n            }\n            url\n            validFrom\n            version\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEventSearchRun($envID: ID!, $functionID: ID!, $runID: ULID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $functionID) {\n        name\n        run(id: $runID) {\n          canRerun\n          history {\n            attempt\n            cancel {\n              eventID\n              expression\n              userID\n            }\n            createdAt\n            functionVersion\n            groupID\n            id\n            sleep {\n              until\n            }\n            stepName\n            type\n            url\n            waitForEvent {\n              eventName\n              expression\n              timeout\n            }\n            waitResult {\n              eventID\n              timeout\n            }\n          }\n          id\n          status\n          startedAt\n          endedAt\n          output\n          version: workflowVersion {\n            deploy {\n              id\n              createdAt\n            }\n            triggers {\n              eventName\n              schedule\n            }\n            url\n            validFrom\n            version\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventLog($environmentID: ID!, $eventName: String!, $cursor: String, $perPage: Int!) {\n    environment: workspace(id: $environmentID) {\n      eventType: event(name: $eventName) {\n        events: recent @cursored(cursor: $cursor, perPage: $perPage) {\n          id\n          receivedAt\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEventLog($environmentID: ID!, $eventName: String!, $cursor: String, $perPage: Int!) {\n    environment: workspace(id: $environmentID) {\n      eventType: event(name: $eventName) {\n        events: recent @cursored(cursor: $cursor, perPage: $perPage) {\n          id\n          receivedAt\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment EventPayload on ArchivedEvent {\n    payload: event\n  }\n'
): (typeof documents)['\n  fragment EventPayload on ArchivedEvent {\n    payload: event\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctionNameSlug($environmentID: ID!, $functionID: ID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        name\n        slug\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctionNameSlug($environmentID: ID!, $functionID: ID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        name\n        slug\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctionRunCard($environmentID: ID!, $functionID: ID!, $functionRunID: ULID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        name\n        slug\n        run(id: $functionRunID) {\n          id\n          status\n          startedAt\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctionRunCard($environmentID: ID!, $functionID: ID!, $functionRunID: ULID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        name\n        slug\n        run(id: $functionRunID) {\n          id\n          status\n          startedAt\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEvent($environmentID: ID!, $eventID: ULID!) {\n    environment: workspace(id: $environmentID) {\n      event: archivedEvent(id: $eventID) {\n        receivedAt\n        ...EventPayload\n        functionRuns {\n          id\n          function {\n            id\n          }\n        }\n        skippedFunctionRuns {\n          id\n          skipReason\n          workflowID\n          skippedAt\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEvent($environmentID: ID!, $eventID: ULID!) {\n    environment: workspace(id: $environmentID) {\n      event: archivedEvent(id: $eventID) {\n        receivedAt\n        ...EventPayload\n        functionRuns {\n          id\n          function {\n            id\n          }\n        }\n        skippedFunctionRuns {\n          id\n          skipReason\n          workflowID\n          skippedAt\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetAccountEntitlements {\n    account {\n      entitlements {\n        history {\n          limit\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetAccountEntitlements {\n    account {\n      entitlements {\n        history {\n          limit\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctionRateLimitDocument(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        ratelimit: metrics(\n          opts: { name: "function_run_rate_limited_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctionRateLimitDocument(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        ratelimit: metrics(\n          opts: { name: "function_run_rate_limited_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctionRunsMetrics(\n    $environmentID: ID!\n    $functionSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        completed: usage(opts: { from: $startTime, to: $endTime }, event: "completed") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        canceled: usage(opts: { from: $startTime, to: $endTime }, event: "cancelled") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        failed: usage(opts: { from: $startTime, to: $endTime }, event: "errored") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctionRunsMetrics(\n    $environmentID: ID!\n    $functionSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        completed: usage(opts: { from: $startTime, to: $endTime }, event: "completed") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        canceled: usage(opts: { from: $startTime, to: $endTime }, event: "cancelled") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        failed: usage(opts: { from: $startTime, to: $endTime }, event: "errored") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFnMetrics($environmentID: ID!, $fnSlug: String!, $startTime: Time!, $endTime: Time!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        queued: metrics(\n          opts: { name: "function_run_scheduled_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        started: metrics(\n          opts: { name: "function_run_started_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        ended: metrics(opts: { name: "function_run_ended_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFnMetrics($environmentID: ID!, $fnSlug: String!, $startTime: Time!, $endTime: Time!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        queued: metrics(\n          opts: { name: "function_run_scheduled_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        started: metrics(\n          opts: { name: "function_run_started_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        ended: metrics(opts: { name: "function_run_ended_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFailedFunctionRuns(\n    $environmentID: ID!\n    $functionSlug: String!\n    $lowerTime: Time!\n    $upperTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        failedRuns: runsV2(\n          filter: {\n            lowerTime: $lowerTime\n            status: [FAILED]\n            timeField: ENDED_AT\n            upperTime: $upperTime\n          }\n          first: 20\n        ) {\n          edges {\n            node {\n              id\n              endedAt\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFailedFunctionRuns(\n    $environmentID: ID!\n    $functionSlug: String!\n    $lowerTime: Time!\n    $upperTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        failedRuns: runsV2(\n          filter: {\n            lowerTime: $lowerTime\n            status: [FAILED]\n            timeField: ENDED_AT\n            upperTime: $upperTime\n          }\n          first: 20\n        ) {\n          edges {\n            node {\n              id\n              endedAt\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetSDKRequestMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        queued: metrics(opts: { name: "sdk_req_scheduled_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        started: metrics(opts: { name: "sdk_req_started_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n\n        ended: metrics(opts: { name: "sdk_req_ended_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetSDKRequestMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        queued: metrics(opts: { name: "sdk_req_scheduled_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        started: metrics(opts: { name: "sdk_req_started_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n\n        ended: metrics(opts: { name: "sdk_req_ended_total", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetStepBacklogMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        scheduled: metrics(opts: { name: "steps_scheduled", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        sleeping: metrics(opts: { name: "steps_sleeping", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetStepBacklogMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        scheduled: metrics(opts: { name: "steps_scheduled", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n        sleeping: metrics(opts: { name: "steps_sleeping", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetStepsRunningMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        running: metrics(opts: { name: "steps_running", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n\n        concurrencyLimit: metrics(\n          opts: { name: "concurrency_limit_reached_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetStepsRunningMetrics(\n    $environmentID: ID!\n    $fnSlug: String!\n    $startTime: Time!\n    $endTime: Time!\n  ) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $fnSlug) {\n        running: metrics(opts: { name: "steps_running", from: $startTime, to: $endTime }) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n\n        concurrencyLimit: metrics(\n          opts: { name: "concurrency_limit_reached_total", from: $startTime, to: $endTime }\n        ) {\n          from\n          to\n          granularity\n          data {\n            bucket\n            value\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteCancellation($envID: UUID!, $cancellationID: ULID!) {\n    deleteCancellation(envID: $envID, cancellationID: $cancellationID)\n  }\n'
): (typeof documents)['\n  mutation DeleteCancellation($envID: UUID!, $cancellationID: ULID!) {\n    deleteCancellation(envID: $envID, cancellationID: $cancellationID)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFnCancellations($after: String, $envSlug: String!, $fnSlug: String!) {\n    env: envBySlug(slug: $envSlug) {\n      fn: workflowBySlug(slug: $fnSlug) {\n        cancellations(after: $after) {\n          edges {\n            cursor\n            node {\n              createdAt\n              envID: environmentID\n              id\n              name\n              queuedAtMax\n              queuedAtMin\n            }\n          }\n          pageInfo {\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFnCancellations($after: String, $envSlug: String!, $fnSlug: String!) {\n    env: envBySlug(slug: $envSlug) {\n      fn: workflowBySlug(slug: $fnSlug) {\n        cancellations(after: $after) {\n          edges {\n            cursor\n            node {\n              createdAt\n              envID: environmentID\n              id\n              name\n              queuedAtMax\n              queuedAtMin\n            }\n          }\n          pageInfo {\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation InvokeFunction($envID: UUID!, $data: Map, $functionSlug: String!, $user: Map) {\n    invokeFunction(envID: $envID, data: $data, functionSlug: $functionSlug, user: $user)\n  }\n'
): (typeof documents)['\n  mutation InvokeFunction($envID: UUID!, $data: Map, $functionSlug: String!, $user: Map) {\n    invokeFunction(envID: $envID, data: $data, functionSlug: $functionSlug, user: $user)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetReplays($environmentID: ID!, $functionSlug: String!) {\n    environment: workspace(id: $environmentID) {\n      id\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        replays {\n          id\n          name\n          createdAt\n          endedAt\n          functionRunsScheduledCount\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetReplays($environmentID: ID!, $functionSlug: String!) {\n    environment: workspace(id: $environmentID) {\n      id\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        replays {\n          id\n          name\n          createdAt\n          endedAt\n          functionRunsScheduledCount\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctionPauseState($environmentID: ID!, $functionSlug: String!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        isPaused\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctionPauseState($environmentID: ID!, $functionSlug: String!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        isPaused\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation NewIngestKey($input: NewIngestKey!) {\n    key: createIngestKey(input: $input) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation NewIngestKey($input: NewIngestKey!) {\n    key: createIngestKey(input: $input) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetIngestKeys($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKeys {\n        id\n        name\n        createdAt\n        source\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetIngestKeys($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKeys {\n        id\n        name\n        createdAt\n        source\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateIngestKey($id: ID!, $input: UpdateIngestKey!) {\n    updateIngestKey(id: $id, input: $input) {\n      id\n      name\n      createdAt\n      presharedKey\n      url\n      filter {\n        type\n        ips\n        events\n      }\n      metadata\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateIngestKey($id: ID!, $input: UpdateIngestKey!) {\n    updateIngestKey(id: $id, input: $input) {\n      id\n      name\n      createdAt\n      presharedKey\n      url\n      filter {\n        type\n        ips\n        events\n      }\n      metadata\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteEventKey($input: DeleteIngestKey!) {\n    deleteIngestKey(input: $input) {\n      ids\n    }\n  }\n'
): (typeof documents)['\n  mutation DeleteEventKey($input: DeleteIngestKey!) {\n    deleteIngestKey(input: $input) {\n      ids\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetIngestKey($environmentID: ID!, $keyID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKey(id: $keyID) {\n        id\n        name\n        createdAt\n        presharedKey\n        url\n        filter {\n          type\n          ips\n          events\n        }\n        metadata\n        source\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetIngestKey($environmentID: ID!, $keyID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKey(id: $keyID) {\n        id\n        name\n        createdAt\n        presharedKey\n        url\n        filter {\n          type\n          ips\n          events\n        }\n        metadata\n        source\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateSigningKey($envID: UUID!) {\n    createSigningKey(envID: $envID) {\n      createdAt\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateSigningKey($envID: UUID!) {\n    createSigningKey(envID: $envID) {\n      createdAt\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteSigningKey($signingKeyID: UUID!) {\n    deleteSigningKey(id: $signingKeyID) {\n      createdAt\n    }\n  }\n'
): (typeof documents)['\n  mutation DeleteSigningKey($signingKeyID: UUID!) {\n    deleteSigningKey(id: $signingKeyID) {\n      createdAt\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RotateSigningKey($envID: UUID!) {\n    rotateSigningKey(envID: $envID) {\n      createdAt\n    }\n  }\n'
): (typeof documents)['\n  mutation RotateSigningKey($envID: UUID!) {\n    rotateSigningKey(envID: $envID) {\n      createdAt\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetSigningKeys($envID: ID!) {\n    environment: workspace(id: $envID) {\n      signingKeys {\n        createdAt\n        decryptedValue\n        id\n        isActive\n        user {\n          email\n          name\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetSigningKeys($envID: ID!) {\n    environment: workspace(id: $envID) {\n      signingKeys {\n        createdAt\n        decryptedValue\n        id\n        isActive\n        user {\n          email\n          name\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query UnattachedSync($syncID: ID!) {\n    sync: deploy(id: $syncID) {\n      commitAuthor\n      commitHash\n      commitMessage\n      commitRef\n      error\n      framework\n      id\n      lastSyncedAt\n      platform\n      repoURL\n      sdkLanguage\n      sdkVersion\n      status\n      removedFunctions: removedFunctions {\n        id\n        name\n        slug\n      }\n      syncedFunctions: deployedFunctions {\n        id\n        name\n        slug\n      }\n      url\n      vercelDeploymentID\n      vercelDeploymentURL\n      vercelProjectID\n      vercelProjectURL\n    }\n  }\n'
): (typeof documents)['\n  query UnattachedSync($syncID: ID!) {\n    sync: deploy(id: $syncID) {\n      commitAuthor\n      commitHash\n      commitMessage\n      commitRef\n      error\n      framework\n      id\n      lastSyncedAt\n      platform\n      repoURL\n      sdkLanguage\n      sdkVersion\n      status\n      removedFunctions: removedFunctions {\n        id\n        name\n        slug\n      }\n      syncedFunctions: deployedFunctions {\n        id\n        name\n        slug\n      }\n      url\n      vercelDeploymentID\n      vercelDeploymentURL\n      vercelProjectID\n      vercelProjectURL\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query UnattachedSyncs($envID: ID!) {\n    environment: workspace(id: $envID) {\n      syncs: unattachedSyncs(first: 40) {\n        commitAuthor\n        commitHash\n        commitMessage\n        commitRef\n        framework\n        id\n        lastSyncedAt\n        platform\n        repoURL\n        sdkLanguage\n        sdkVersion\n        status\n        url\n        vercelDeploymentID\n        vercelDeploymentURL\n        vercelProjectID\n        vercelProjectURL\n      }\n    }\n  }\n'
): (typeof documents)['\n  query UnattachedSyncs($envID: ID!) {\n    environment: workspace(id: $envID) {\n      syncs: unattachedSyncs(first: 40) {\n        commitAuthor\n        commitHash\n        commitMessage\n        commitRef\n        framework\n        id\n        lastSyncedAt\n        platform\n        repoURL\n        sdkLanguage\n        sdkVersion\n        status\n        url\n        vercelDeploymentID\n        vercelDeploymentURL\n        vercelProjectID\n        vercelProjectURL\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query VercelIntegration {\n    account {\n      vercelIntegration {\n        isMarketplace\n        projects {\n          canChangeEnabled\n          deploymentProtection\n          isEnabled\n          name\n          originOverride\n          projectID\n          protectionBypassSecret\n          servePath\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query VercelIntegration {\n    account {\n      vercelIntegration {\n        isMarketplace\n        projects {\n          canChangeEnabled\n          deploymentProtection\n          isEnabled\n          name\n          originOverride\n          projectID\n          protectionBypassSecret\n          servePath\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetSavedVercelProjects($environmentID: ID!) {\n    account {\n      marketplace\n    }\n\n    environment: workspace(id: $environmentID) {\n      savedVercelProjects: vercelApps {\n        id\n        originOverride\n        projectID\n        protectionBypassSecret\n        path\n        workspaceID\n        originOverride\n        protectionBypassSecret\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetSavedVercelProjects($environmentID: ID!) {\n    account {\n      marketplace\n    }\n\n    environment: workspace(id: $environmentID) {\n      savedVercelProjects: vercelApps {\n        id\n        originOverride\n        projectID\n        protectionBypassSecret\n        path\n        workspaceID\n        originOverride\n        protectionBypassSecret\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateVercelApp($input: CreateVercelAppInput!) {\n    createVercelApp(input: $input) {\n      success\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateVercelApp($input: CreateVercelAppInput!) {\n    createVercelApp(input: $input) {\n      success\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateVercelApp($input: UpdateVercelAppInput!) {\n    updateVercelApp(input: $input) {\n      success\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateVercelApp($input: UpdateVercelAppInput!) {\n    updateVercelApp(input: $input) {\n      success\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RemoveVercelApp($input: RemoveVercelAppInput!) {\n    removeVercelApp(input: $input) {\n      success\n    }\n  }\n'
): (typeof documents)['\n  mutation RemoveVercelApp($input: RemoveVercelAppInput!) {\n    removeVercelApp(input: $input) {\n      success\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateWebhook($input: NewIngestKey!) {\n    key: createIngestKey(input: $input) {\n      id\n      url\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateWebhook($input: NewIngestKey!) {\n    key: createIngestKey(input: $input) {\n      id\n      url\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CompleteAWSMarketplaceSetup($input: AWSMarketplaceSetupInput!) {\n    completeAWSMarketplaceSetup(input: $input) {\n      message\n    }\n  }\n'
): (typeof documents)['\n  mutation CompleteAWSMarketplaceSetup($input: AWSMarketplaceSetupInput!) {\n    completeAWSMarketplaceSetup(input: $input) {\n      message\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetAccountSupportInfo {\n    account {\n      id\n      plan {\n        id\n        name\n        amount\n        features\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetAccountSupportInfo {\n    account {\n      id\n      plan {\n        id\n        name\n        amount\n        features\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetArchivedAppBannerData($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        isArchived\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetArchivedAppBannerData($envID: ID!, $externalAppID: String!) {\n    environment: workspace(id: $envID) {\n      app: appByExternalID(externalID: $externalAppID) {\n        isArchived\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetArchivedFuncBannerData($envID: ID!, $funcID: ID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $funcID) {\n        id\n        archivedAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetArchivedFuncBannerData($envID: ID!, $funcID: ID!) {\n    environment: workspace(id: $envID) {\n      function: workflow(id: $funcID) {\n        id\n        archivedAt\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateAccountAddonQuantity($addonName: String!, $quantity: Int!) {\n    updateAccountAddonQuantity(addonName: $addonName, quantity: $quantity) {\n      purchaseCount\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateAccountAddonQuantity($addonName: String!, $quantity: Int!) {\n    updateAccountAddonQuantity(addonName: $addonName, quantity: $quantity) {\n      purchaseCount\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateAccount($input: UpdateAccount!) {\n    account: updateAccount(input: $input) {\n      billingEmail\n      name\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateAccount($input: UpdateAccount!) {\n    account: updateAccount(input: $input) {\n      billingEmail\n      name\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdatePaymentMethod($token: String!) {\n    updatePaymentMethod(token: $token) {\n      brand\n      last4\n      expMonth\n      expYear\n      createdAt\n      default\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdatePaymentMethod($token: String!) {\n    updatePaymentMethod(token: $token) {\n      brand\n      last4\n      expMonth\n      expYear\n      createdAt\n      default\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetPaymentIntents {\n    account {\n      paymentIntents {\n        status\n        createdAt\n        amountLabel\n        description\n        invoiceURL\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetPaymentIntents {\n    account {\n      paymentIntents {\n        status\n        createdAt\n        amountLabel\n        description\n        invoiceURL\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateStripeSubscription($input: StripeSubscriptionInput!) {\n    createStripeSubscription(input: $input) {\n      clientSecret\n      message\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateStripeSubscription($input: StripeSubscriptionInput!) {\n    createStripeSubscription(input: $input) {\n      clientSecret\n      message\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdatePlan($planID: ID!) {\n    updatePlan(to: $planID) {\n      plan {\n        id\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdatePlan($planID: ID!) {\n    updatePlan(to: $planID) {\n      plan {\n        id\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetBillableSteps($month: Int!, $year: Int!) {\n    usage: billableStepTimeSeries(timeOptions: { month: $month, year: $year }) {\n      data {\n        time\n        value\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetBillableSteps($month: Int!, $year: Int!) {\n    usage: billableStepTimeSeries(timeOptions: { month: $month, year: $year }) {\n      data {\n        time\n        value\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetBillableRuns($month: Int!, $year: Int!) {\n    usage: runCountTimeSeries(timeOptions: { month: $month, year: $year }) {\n      data {\n        time\n        value\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetBillableRuns($month: Int!, $year: Int!) {\n    usage: runCountTimeSeries(timeOptions: { month: $month, year: $year }) {\n      data {\n        time\n        value\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query EntitlementUsage {\n    account {\n      id\n      addons {\n        concurrency {\n          available\n          baseValue\n          maxValue\n          name\n          price\n          purchaseCount\n          quantityPer\n        }\n        userCount {\n          available\n          baseValue\n          maxValue\n          name\n          price\n          purchaseCount\n          quantityPer\n        }\n      }\n      entitlements {\n        runCount {\n          usage\n          limit\n          overageAllowed\n        }\n        stepCount {\n          usage\n          limit\n          overageAllowed\n        }\n        concurrency {\n          usage\n          limit\n        }\n        eventSize {\n          limit\n        }\n        history {\n          limit\n        }\n        userCount {\n          usage\n          limit\n        }\n        hipaa {\n          enabled\n        }\n        metricsExport {\n          enabled\n        }\n        metricsExportFreshness {\n          limit\n        }\n        metricsExportGranularity {\n          limit\n        }\n      }\n      plan {\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  query EntitlementUsage {\n    account {\n      id\n      addons {\n        concurrency {\n          available\n          baseValue\n          maxValue\n          name\n          price\n          purchaseCount\n          quantityPer\n        }\n        userCount {\n          available\n          baseValue\n          maxValue\n          name\n          price\n          purchaseCount\n          quantityPer\n        }\n      }\n      entitlements {\n        runCount {\n          usage\n          limit\n          overageAllowed\n        }\n        stepCount {\n          usage\n          limit\n          overageAllowed\n        }\n        concurrency {\n          usage\n          limit\n        }\n        eventSize {\n          limit\n        }\n        history {\n          limit\n        }\n        userCount {\n          usage\n          limit\n        }\n        hipaa {\n          enabled\n        }\n        metricsExport {\n          enabled\n        }\n        metricsExportFreshness {\n          limit\n        }\n        metricsExportGranularity {\n          limit\n        }\n      }\n      plan {\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetCurrentPlan {\n    account {\n      plan {\n        id\n        name\n        amount\n        billingPeriod\n        entitlements {\n          concurrency {\n            limit\n          }\n          eventSize {\n            limit\n          }\n          history {\n            limit\n          }\n          runCount {\n            limit\n          }\n          stepCount {\n            limit\n          }\n          userCount {\n            limit\n          }\n        }\n        addons {\n          concurrency {\n            available\n            price\n            purchaseCount\n            quantityPer\n          }\n          userCount {\n            available\n            price\n            purchaseCount\n            quantityPer\n          }\n        }\n      }\n      subscription {\n        nextInvoiceDate\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetCurrentPlan {\n    account {\n      plan {\n        id\n        name\n        amount\n        billingPeriod\n        entitlements {\n          concurrency {\n            limit\n          }\n          eventSize {\n            limit\n          }\n          history {\n            limit\n          }\n          runCount {\n            limit\n          }\n          stepCount {\n            limit\n          }\n          userCount {\n            limit\n          }\n        }\n        addons {\n          concurrency {\n            available\n            price\n            purchaseCount\n            quantityPer\n          }\n          userCount {\n            available\n            price\n            purchaseCount\n            quantityPer\n          }\n        }\n      }\n      subscription {\n        nextInvoiceDate\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetBillingDetails {\n    account {\n      billingEmail\n      name\n      paymentMethods {\n        brand\n        last4\n        expMonth\n        expYear\n        createdAt\n        default\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetBillingDetails {\n    account {\n      billingEmail\n      name\n      paymentMethods {\n        brand\n        last4\n        expMonth\n        expYear\n        createdAt\n        default\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetPlans {\n    plans {\n      id\n      name\n      amount\n      billingPeriod\n      entitlements {\n        concurrency {\n          limit\n        }\n        eventSize {\n          limit\n        }\n        history {\n          limit\n        }\n        runCount {\n          limit\n        }\n        stepCount {\n          limit\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetPlans {\n    plans {\n      id\n      name\n      amount\n      billingPeriod\n      entitlements {\n        concurrency {\n          limit\n        }\n        eventSize {\n          limit\n        }\n        history {\n          limit\n        }\n        runCount {\n          limit\n        }\n        stepCount {\n          limit\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ArchiveEnvironment($id: ID!) {\n    archiveEnvironment(id: $id) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ArchiveEnvironment($id: ID!) {\n    archiveEnvironment(id: $id) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UnarchiveEnvironment($id: ID!) {\n    unarchiveEnvironment(id: $id) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation UnarchiveEnvironment($id: ID!) {\n    unarchiveEnvironment(id: $id) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DisableEnvironmentAutoArchiveDocument($id: ID!) {\n    disableEnvironmentAutoArchive(id: $id) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation DisableEnvironmentAutoArchiveDocument($id: ID!) {\n    disableEnvironmentAutoArchive(id: $id) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation EnableEnvironmentAutoArchive($id: ID!) {\n    enableEnvironmentAutoArchive(id: $id) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation EnableEnvironmentAutoArchive($id: ID!) {\n    enableEnvironmentAutoArchive(id: $id) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ArchiveEvent($environmentId: ID!, $name: String!) {\n    archiveEvent(workspaceID: $environmentId, name: $name) {\n      name\n    }\n  }\n'
): (typeof documents)['\n  mutation ArchiveEvent($environmentId: ID!, $name: String!) {\n    archiveEvent(workspaceID: $environmentId, name: $name) {\n      name\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetLatestEventLogs($name: String, $environmentID: ID!) {\n    events(query: { name: $name, workspaceID: $environmentID }) {\n      data {\n        recent(count: 5) {\n          id\n          receivedAt\n          event\n          source {\n            name\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetLatestEventLogs($name: String, $environmentID: ID!) {\n    events(query: { name: $name, workspaceID: $environmentID }) {\n      data {\n        recent(count: 5) {\n          id\n          receivedAt\n          event\n          source {\n            name\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventKeys($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      eventKeys: ingestKeys {\n        name\n        value: presharedKey\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEventKeys($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      eventKeys: ingestKeys {\n        name\n        value: presharedKey\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateCancellation($input: CreateCancellationInput!) {\n    createCancellation(input: $input) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateCancellation($input: CreateCancellationInput!) {\n    createCancellation(input: $input) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetCancellationRunCount(\n    $envID: ID!\n    $functionSlug: String!\n    $queuedAtMin: Time\n    $queuedAtMax: Time!\n  ) {\n    environment: workspace(id: $envID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        cancellationRunCount(input: { queuedAtMin: $queuedAtMin, queuedAtMax: $queuedAtMax })\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetCancellationRunCount(\n    $envID: ID!\n    $functionSlug: String!\n    $queuedAtMin: Time\n    $queuedAtMax: Time!\n  ) {\n    environment: workspace(id: $envID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        cancellationRunCount(input: { queuedAtMin: $queuedAtMin, queuedAtMax: $queuedAtMax })\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation PauseFunction($fnID: ID!, $cancelRunning: Boolean) {\n    pauseFunction(fnID: $fnID, cancelRunning: $cancelRunning) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation PauseFunction($fnID: ID!, $cancelRunning: Boolean) {\n    pauseFunction(fnID: $fnID, cancelRunning: $cancelRunning) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UnpauseFunction($fnID: ID!) {\n    unpauseFunction(fnID: $fnID) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation UnpauseFunction($fnID: ID!) {\n    unpauseFunction(fnID: $fnID) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MetricsLookups($envSlug: String!, $page: Int, $pageSize: Int) {\n    envBySlug(slug: $envSlug) {\n      apps {\n        externalID\n        id\n        name\n        isArchived\n      }\n      workflows @paginated(perPage: $pageSize, page: $page) {\n        data {\n          name\n          id\n          slug\n        }\n        page {\n          page\n          totalPages\n          perPage\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query MetricsLookups($envSlug: String!, $page: Int, $pageSize: Int) {\n    envBySlug(slug: $envSlug) {\n      apps {\n        externalID\n        id\n        name\n        isArchived\n      }\n      workflows @paginated(perPage: $pageSize, page: $page) {\n        data {\n          name\n          id\n          slug\n        }\n        page {\n          page\n          totalPages\n          perPage\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AccountConcurrencyLookup {\n    account {\n      entitlements {\n        concurrency {\n          limit\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query AccountConcurrencyLookup {\n    account {\n      entitlements {\n        concurrency {\n          limit\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query FunctionStatusMetrics(\n    $workspaceId: ID!\n    $from: Time!\n    $functionIDs: [UUID!]\n    $appIDs: [UUID!]\n    $until: Time\n    $scope: MetricsScope!\n  ) {\n    workspace(id: $workspaceId) {\n      scheduled: scopedMetrics(\n        filter: {\n          name: "function_run_scheduled_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      started: scopedMetrics(\n        filter: {\n          name: "function_run_started_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      completed: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: $scope\n          groupBy: "status"\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      completedByFunction: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: FN\n          groupBy: "status"\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      totals: scopedFunctionStatus(\n        filter: {\n          name: "function_run_scheduled_total"\n          scope: FN\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        queued\n        running\n        completed\n        failed\n        cancelled\n        cancelled\n        skipped\n      }\n    }\n  }\n'
): (typeof documents)['\n  query FunctionStatusMetrics(\n    $workspaceId: ID!\n    $from: Time!\n    $functionIDs: [UUID!]\n    $appIDs: [UUID!]\n    $until: Time\n    $scope: MetricsScope!\n  ) {\n    workspace(id: $workspaceId) {\n      scheduled: scopedMetrics(\n        filter: {\n          name: "function_run_scheduled_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      started: scopedMetrics(\n        filter: {\n          name: "function_run_started_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      completed: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: $scope\n          groupBy: "status"\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      completedByFunction: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: FN\n          groupBy: "status"\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      totals: scopedFunctionStatus(\n        filter: {\n          name: "function_run_scheduled_total"\n          scope: FN\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        queued\n        running\n        completed\n        failed\n        cancelled\n        cancelled\n        skipped\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query VolumeMetrics(\n    $workspaceId: ID!\n    $from: Time!\n    $functionIDs: [UUID!]\n    $appIDs: [UUID!]\n    $until: Time\n    $scope: MetricsScope!\n  ) {\n    workspace(id: $workspaceId) {\n      runsThroughput: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputEnded: scopedMetrics(\n        filter: {\n          name: "sdk_req_ended_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputStarted: scopedMetrics(\n        filter: {\n          name: "sdk_req_started_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputScheduled: scopedMetrics(\n        filter: {\n          name: "sdk_req_scheduled_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      stepThroughput: scopedMetrics(\n        filter: {\n          name: "steps_running"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      backlog: scopedMetrics(\n        filter: {\n          name: "steps_scheduled"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      stepRunning: scopedMetrics(\n        filter: {\n          name: "steps_running"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      concurrency: scopedMetrics(\n        filter: {\n          name: "concurrency_limit_reached_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query VolumeMetrics(\n    $workspaceId: ID!\n    $from: Time!\n    $functionIDs: [UUID!]\n    $appIDs: [UUID!]\n    $until: Time\n    $scope: MetricsScope!\n  ) {\n    workspace(id: $workspaceId) {\n      runsThroughput: scopedMetrics(\n        filter: {\n          name: "function_run_ended_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputEnded: scopedMetrics(\n        filter: {\n          name: "sdk_req_ended_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputStarted: scopedMetrics(\n        filter: {\n          name: "sdk_req_started_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      sdkThroughputScheduled: scopedMetrics(\n        filter: {\n          name: "sdk_req_scheduled_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      stepThroughput: scopedMetrics(\n        filter: {\n          name: "steps_running"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      backlog: scopedMetrics(\n        filter: {\n          name: "steps_scheduled"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      stepRunning: scopedMetrics(\n        filter: {\n          name: "steps_running"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n    workspace(id: $workspaceId) {\n      concurrency: scopedMetrics(\n        filter: {\n          name: "concurrency_limit_reached_total"\n          scope: $scope\n          from: $from\n          functionIDs: $functionIDs\n          appIDs: $appIDs\n          until: $until\n        }\n      ) {\n        metrics {\n          id\n          tagName\n          tagValue\n          data {\n            value\n            bucket\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query QuickSearch($term: String!, $envSlug: String!) {\n    account {\n      quickSearch(term: $term, envSlug: $envSlug) {\n        apps {\n          name\n        }\n        event {\n          id\n          name\n        }\n        eventTypes {\n          name\n        }\n        functions {\n          name\n          slug\n        }\n        run {\n          id\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query QuickSearch($term: String!, $envSlug: String!) {\n    account {\n      quickSearch(term: $term, envSlug: $envSlug) {\n        apps {\n          name\n        }\n        event {\n          id\n          name\n        }\n        eventTypes {\n          name\n        }\n        functions {\n          name\n          slug\n        }\n        run {\n          id\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetGlobalSearch($opts: SearchInput!) {\n    account {\n      search(opts: $opts) {\n        results {\n          env {\n            name\n            id\n            type\n            slug\n          }\n          kind\n          value {\n            ... on ArchivedEvent {\n              id\n              name\n            }\n            ... on FunctionRun {\n              id\n              functionID: workflowID\n              startedAt\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetGlobalSearch($opts: SearchInput!) {\n    account {\n      search(opts: $opts) {\n        results {\n          env {\n            name\n            id\n            type\n            slug\n          }\n          kind\n          value {\n            ... on ArchivedEvent {\n              id\n              name\n            }\n            ... on FunctionRun {\n              id\n              functionID: workflowID\n              startedAt\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctionSlug($environmentID: ID!, $functionID: ID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        slug\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctionSlug($environmentID: ID!, $functionID: ID!) {\n    environment: workspace(id: $environmentID) {\n      function: workflow(id: $functionID) {\n        slug\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SyncOnboardingApp($appURL: String!, $envID: UUID!) {\n    syncNewApp(appURL: $appURL, envID: $envID) {\n      app {\n        externalID\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation SyncOnboardingApp($appURL: String!, $envID: UUID!) {\n    syncNewApp(appURL: $appURL, envID: $envID) {\n      app {\n        externalID\n        id\n      }\n      error {\n        code\n        data\n        message\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation InvokeFunctionOnboarding($envID: UUID!, $data: Map, $functionSlug: String!, $user: Map) {\n    invokeFunction(envID: $envID, data: $data, functionSlug: $functionSlug, user: $user)\n  }\n'
): (typeof documents)['\n  mutation InvokeFunctionOnboarding($envID: UUID!, $data: Map, $functionSlug: String!, $user: Map) {\n    invokeFunction(envID: $envID, data: $data, functionSlug: $functionSlug, user: $user)\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query InvokeFunctionLookup($envSlug: String!, $page: Int, $pageSize: Int) {\n    envBySlug(slug: $envSlug) {\n      workflows @paginated(perPage: $pageSize, page: $page) {\n        data {\n          name\n          id\n          slug\n          current {\n            triggers {\n              eventName\n            }\n          }\n        }\n        page {\n          page\n          totalPages\n          perPage\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query InvokeFunctionLookup($envSlug: String!, $page: Int, $pageSize: Int) {\n    envBySlug(slug: $envSlug) {\n      workflows @paginated(perPage: $pageSize, page: $page) {\n        data {\n          name\n          id\n          slug\n          current {\n            triggers {\n              eventName\n            }\n          }\n        }\n        page {\n          page\n          totalPages\n          perPage\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetVercelApps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n        error\n        url\n        vercelDeploymentURL\n      }\n      apps {\n        id\n        name\n        externalID\n        isArchived\n        latestSync {\n          error\n          id\n          platform\n          vercelDeploymentID\n          vercelProjectID\n          status\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetVercelApps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n        error\n        url\n        vercelDeploymentURL\n      }\n      apps {\n        id\n        name\n        externalID\n        isArchived\n        latestSync {\n          error\n          id\n          platform\n          vercelDeploymentID\n          vercelProjectID\n          status\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ProductionApps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      apps {\n        id\n      }\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query ProductionApps($envID: ID!) {\n    environment: workspace(id: $envID) {\n      apps {\n        id\n      }\n      unattachedSyncs(first: 1) {\n        lastSyncedAt\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query getPostgresIntegrations($envID: ID!) {\n    environment: workspace(id: $envID) {\n      cdcConnections {\n        id\n        name\n        status\n        statusDetail\n        description\n      }\n    }\n  }\n'
): (typeof documents)['\n  query getPostgresIntegrations($envID: ID!) {\n    environment: workspace(id: $envID) {\n      cdcConnections {\n        id\n        name\n        status\n        statusDetail\n        description\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation testCredentials($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcTestCredentials(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n'
): (typeof documents)['\n  mutation testCredentials($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcTestCredentials(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation testReplication($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcTestLogicalReplication(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n'
): (typeof documents)['\n  mutation testReplication($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcTestLogicalReplication(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation testAutoSetup($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcAutoSetup(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n'
): (typeof documents)['\n  mutation testAutoSetup($input: CDCConnectionInput!, $envID: UUID!) {\n    cdcAutoSetup(input: $input, envID: $envID) {\n      steps\n      error\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation cdcDelete($envID: UUID!, $id: UUID!) {\n    cdcDelete(envID: $envID, id: $id) {\n      ids\n    }\n  }\n'
): (typeof documents)['\n  mutation cdcDelete($envID: UUID!, $id: UUID!) {\n    cdcDelete(envID: $envID, id: $id) {\n      ids\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MetricsEntitlements {\n    account {\n      id\n      entitlements {\n        metricsExport {\n          enabled\n        }\n        metricsExportFreshness {\n          limit\n        }\n        metricsExportGranularity {\n          limit\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query MetricsEntitlements {\n    account {\n      id\n      entitlements {\n        metricsExport {\n          enabled\n        }\n        metricsExportFreshness {\n          limit\n        }\n        metricsExportGranularity {\n          limit\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetReplayRunCounts($environmentID: ID!, $functionSlug: String!, $from: Time!, $to: Time!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        replayCounts: replayCounts(from: $from, to: $to) {\n          completedCount\n          failedCount\n          cancelledCount\n          skippedPausedCount\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetReplayRunCounts($environmentID: ID!, $functionSlug: String!, $from: Time!, $to: Time!) {\n    environment: workspace(id: $environmentID) {\n      function: workflowBySlug(slug: $functionSlug) {\n        id\n        replayCounts: replayCounts(from: $from, to: $to) {\n          completedCount\n          failedCount\n          cancelledCount\n          skippedPausedCount\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateFunctionReplay(\n    $environmentID: UUID!\n    $functionID: UUID!\n    $name: String!\n    $fromRange: ULID!\n    $toRange: ULID!\n    $statuses: [ReplayRunStatus!]\n  ) {\n    createFunctionReplay(\n      input: {\n        workspaceID: $environmentID\n        workflowID: $functionID\n        name: $name\n        fromRange: $fromRange\n        toRange: $toRange\n        statusesV2: $statuses\n      }\n    ) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateFunctionReplay(\n    $environmentID: UUID!\n    $functionID: UUID!\n    $name: String!\n    $fromRange: ULID!\n    $toRange: ULID!\n    $statuses: [ReplayRunStatus!]\n  ) {\n    createFunctionReplay(\n      input: {\n        workspaceID: $environmentID\n        workflowID: $functionID\n        name: $name\n        fromRange: $fromRange\n        toRange: $toRange\n        statusesV2: $statuses\n      }\n    ) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TraceDetails on RunTraceSpan {\n    name\n    status\n    attempts\n    queuedAt\n    startedAt\n    endedAt\n    isRoot\n    outputID\n    stepID\n    spanID\n    stepOp\n    stepInfo {\n      __typename\n      ... on InvokeStepInfo {\n        triggeringEventID\n        functionID\n        timeout\n        returnEventID\n        runID\n        timedOut\n      }\n      ... on SleepStepInfo {\n        sleepUntil\n      }\n      ... on WaitForEventStepInfo {\n        eventName\n        expression\n        timeout\n        foundEventID\n        timedOut\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment TraceDetails on RunTraceSpan {\n    name\n    status\n    attempts\n    queuedAt\n    startedAt\n    endedAt\n    isRoot\n    outputID\n    stepID\n    spanID\n    stepOp\n    stepInfo {\n      __typename\n      ... on InvokeStepInfo {\n        triggeringEventID\n        functionID\n        timeout\n        returnEventID\n        runID\n        timedOut\n      }\n      ... on SleepStepInfo {\n        sleepUntil\n      }\n      ... on WaitForEventStepInfo {\n        eventName\n        expression\n        timeout\n        foundEventID\n        timedOut\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetRunTrace($envID: ID!, $runID: String!) {\n    workspace(id: $envID) {\n      run(runID: $runID) {\n        function {\n          app {\n            name\n            externalID\n          }\n          id\n          name\n          slug\n        }\n        trace {\n          ...TraceDetails\n          childrenSpans {\n            ...TraceDetails\n            childrenSpans {\n              ...TraceDetails\n            }\n          }\n        }\n        hasAI\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetRunTrace($envID: ID!, $runID: String!) {\n    workspace(id: $envID) {\n      run(runID: $runID) {\n        function {\n          app {\n            name\n            externalID\n          }\n          id\n          name\n          slug\n        }\n        trace {\n          ...TraceDetails\n          childrenSpans {\n            ...TraceDetails\n            childrenSpans {\n              ...TraceDetails\n            }\n          }\n        }\n        hasAI\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query TraceResult($envID: ID!, $traceID: String!) {\n    workspace(id: $envID) {\n      runTraceSpanOutputByID(outputID: $traceID) {\n        data\n        input\n        error {\n          message\n          name\n          stack\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query TraceResult($envID: ID!, $traceID: String!) {\n    workspace(id: $envID) {\n      runTraceSpanOutputByID(outputID: $traceID) {\n        data\n        input\n        error {\n          message\n          name\n          stack\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetRunTraceTrigger($envID: ID!, $runID: String!) {\n    workspace(id: $envID) {\n      runTrigger(runID: $runID) {\n        IDs\n        payloads\n        timestamp\n        eventName\n        isBatch\n        batchID\n        cron\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetRunTraceTrigger($envID: ID!, $runID: String!) {\n    workspace(id: $envID) {\n      runTrigger(runID: $runID) {\n        IDs\n        payloads\n        timestamp\n        eventName\n        isBatch\n        batchID\n        cron\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetRuns(\n    $appIDs: [UUID!]\n    $environmentID: ID!\n    $startTime: Time!\n    $endTime: Time\n    $status: [FunctionRunStatus!]\n    $timeField: RunsOrderByField!\n    $functionSlug: String\n    $functionRunCursor: String = null\n    $celQuery: String = null\n  ) {\n    environment: workspace(id: $environmentID) {\n      runs(\n        filter: {\n          appIDs: $appIDs\n          from: $startTime\n          until: $endTime\n          status: $status\n          timeField: $timeField\n          fnSlug: $functionSlug\n          query: $celQuery\n        }\n        orderBy: [{ field: $timeField, direction: DESC }]\n        after: $functionRunCursor\n      ) {\n        edges {\n          node {\n            app {\n              externalID\n              name\n            }\n            cronSchedule\n            eventName\n            function {\n              name\n              slug\n            }\n            id\n            isBatch\n            queuedAt\n            endedAt\n            startedAt\n            status\n            hasAI\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetRuns(\n    $appIDs: [UUID!]\n    $environmentID: ID!\n    $startTime: Time!\n    $endTime: Time\n    $status: [FunctionRunStatus!]\n    $timeField: RunsOrderByField!\n    $functionSlug: String\n    $functionRunCursor: String = null\n    $celQuery: String = null\n  ) {\n    environment: workspace(id: $environmentID) {\n      runs(\n        filter: {\n          appIDs: $appIDs\n          from: $startTime\n          until: $endTime\n          status: $status\n          timeField: $timeField\n          fnSlug: $functionSlug\n          query: $celQuery\n        }\n        orderBy: [{ field: $timeField, direction: DESC }]\n        after: $functionRunCursor\n      ) {\n        edges {\n          node {\n            app {\n              externalID\n              name\n            }\n            cronSchedule\n            eventName\n            function {\n              name\n              slug\n            }\n            id\n            isBatch\n            queuedAt\n            endedAt\n            startedAt\n            status\n            hasAI\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CountRuns(\n    $appIDs: [UUID!]\n    $environmentID: ID!\n    $startTime: Time!\n    $endTime: Time\n    $status: [FunctionRunStatus!]\n    $timeField: RunsOrderByField!\n    $functionSlug: String\n    $celQuery: String = null\n  ) {\n    environment: workspace(id: $environmentID) {\n      runs(\n        filter: {\n          appIDs: $appIDs\n          from: $startTime\n          until: $endTime\n          status: $status\n          timeField: $timeField\n          fnSlug: $functionSlug\n          query: $celQuery\n        }\n        orderBy: [{ field: $timeField, direction: DESC }]\n      ) {\n        totalCount\n      }\n    }\n  }\n'
): (typeof documents)['\n  query CountRuns(\n    $appIDs: [UUID!]\n    $environmentID: ID!\n    $startTime: Time!\n    $endTime: Time\n    $status: [FunctionRunStatus!]\n    $timeField: RunsOrderByField!\n    $functionSlug: String\n    $celQuery: String = null\n  ) {\n    environment: workspace(id: $environmentID) {\n      runs(\n        filter: {\n          appIDs: $appIDs\n          from: $startTime\n          until: $endTime\n          status: $status\n          timeField: $timeField\n          fnSlug: $functionSlug\n          query: $celQuery\n        }\n        orderBy: [{ field: $timeField, direction: DESC }]\n      ) {\n        totalCount\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query AppFilter($envSlug: String!) {\n    env: envBySlug(slug: $envSlug) {\n      apps {\n        externalID\n        id\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  query AppFilter($envSlug: String!) {\n    env: envBySlug(slug: $envSlug) {\n      apps {\n        externalID\n        id\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetWorkerConnections(\n    $envID: ID!\n    $appID: UUID!\n    $startTime: Time!\n    $status: [ConnectV1ConnectionStatus!]\n    $timeField: ConnectV1WorkerConnectionsOrderByField!\n    $cursor: String = null\n    $orderBy: [ConnectV1WorkerConnectionsOrderBy!] = []\n    $first: Int!\n  ) {\n    environment: workspace(id: $envID) {\n      workerConnections(\n        first: $first\n        filter: { appIDs: [$appID], from: $startTime, status: $status, timeField: $timeField }\n        orderBy: $orderBy\n        after: $cursor\n      ) {\n        edges {\n          node {\n            id\n            gatewayId\n            instanceID: instanceId\n            workerIp\n            app {\n              id\n            }\n            connectedAt\n            lastHeartbeatAt\n            disconnectedAt\n            disconnectReason\n            status\n            sdkLang\n            sdkVersion\n            sdkPlatform\n            appVersion: buildId\n            functionCount\n            cpuCores\n            memBytes\n            os\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetWorkerConnections(\n    $envID: ID!\n    $appID: UUID!\n    $startTime: Time!\n    $status: [ConnectV1ConnectionStatus!]\n    $timeField: ConnectV1WorkerConnectionsOrderByField!\n    $cursor: String = null\n    $orderBy: [ConnectV1WorkerConnectionsOrderBy!] = []\n    $first: Int!\n  ) {\n    environment: workspace(id: $envID) {\n      workerConnections(\n        first: $first\n        filter: { appIDs: [$appID], from: $startTime, status: $status, timeField: $timeField }\n        orderBy: $orderBy\n        after: $cursor\n      ) {\n        edges {\n          node {\n            id\n            gatewayId\n            instanceID: instanceId\n            workerIp\n            app {\n              id\n            }\n            connectedAt\n            lastHeartbeatAt\n            disconnectedAt\n            disconnectReason\n            status\n            sdkLang\n            sdkVersion\n            sdkPlatform\n            appVersion: buildId\n            functionCount\n            cpuCores\n            memBytes\n            os\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetWorkerCountConnections(\n    $envID: ID!\n    $appID: UUID!\n    $startTime: Time!\n    $status: [ConnectV1ConnectionStatus!] = []\n    $timeField: ConnectV1WorkerConnectionsOrderByField!\n  ) {\n    environment: workspace(id: $envID) {\n      workerConnections(\n        filter: { appIDs: [$appID], from: $startTime, status: $status, timeField: $timeField }\n        orderBy: [{ field: $timeField, direction: DESC }]\n      ) {\n        totalCount\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetWorkerCountConnections(\n    $envID: ID!\n    $appID: UUID!\n    $startTime: Time!\n    $status: [ConnectV1ConnectionStatus!] = []\n    $timeField: ConnectV1WorkerConnectionsOrderByField!\n  ) {\n    environment: workspace(id: $envID) {\n      workerConnections(\n        filter: { appIDs: [$appID], from: $startTime, status: $status, timeField: $timeField }\n        orderBy: [{ field: $timeField, direction: DESC }]\n      ) {\n        totalCount\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetDeployss($environmentID: ID!) {\n    deploys(workspaceID: $environmentID) {\n      id\n      appName\n      authorID\n      checksum\n      createdAt\n      error\n      framework\n      metadata\n      sdkLanguage\n      sdkVersion\n      status\n\n      deployedFunctions {\n        id\n        name\n      }\n\n      removedFunctions {\n        id\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetDeployss($environmentID: ID!) {\n    deploys(workspaceID: $environmentID) {\n      id\n      appName\n      authorID\n      checksum\n      createdAt\n      error\n      framework\n      metadata\n      sdkLanguage\n      sdkVersion\n      status\n\n      deployedFunctions {\n        id\n        name\n      }\n\n      removedFunctions {\n        id\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEnvironments {\n    workspaces {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      webhookSigningKey\n      createdAt\n      isArchived\n      isAutoArchiveEnabled\n      lastDeployedAt\n    }\n  }\n'
): (typeof documents)['\n  query GetEnvironments {\n    workspaces {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      webhookSigningKey\n      createdAt\n      isArchived\n      isAutoArchiveEnabled\n      lastDeployedAt\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEnvironmentBySlug($slug: String!) {\n    envBySlug(slug: $slug) {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n      webhookSigningKey\n    }\n  }\n'
): (typeof documents)['\n  query GetEnvironmentBySlug($slug: String!) {\n    envBySlug(slug: $slug) {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n      webhookSigningKey\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetDefaultEnvironment {\n    defaultEnv {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n    }\n  }\n'
): (typeof documents)['\n  query GetDefaultEnvironment {\n    defaultEnv {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventTypes($environmentID: ID!, $page: Int) {\n    workspace(id: $environmentID) {\n      events @paginated(perPage: 50, page: $page) {\n        data {\n          name\n          functions: workflows {\n            id\n            slug\n            name\n          }\n        }\n        page {\n          page\n          totalPages\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEventTypes($environmentID: ID!, $page: Int) {\n    workspace(id: $environmentID) {\n      events @paginated(perPage: 50, page: $page) {\n        data {\n          name\n          functions: workflows {\n            id\n            slug\n            name\n          }\n        }\n        page {\n          page\n          totalPages\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventTypesVolume($environmentID: ID!, $page: Int) {\n    workspace(id: $environmentID) {\n      events @paginated(perPage: 50, page: $page) {\n        data {\n          name\n          dailyVolume: usage(opts: { period: "hour", range: "day" }) {\n            total\n            data {\n              count\n            }\n          }\n        }\n        page {\n          page\n          totalPages\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEventTypesVolume($environmentID: ID!, $page: Int) {\n    workspace(id: $environmentID) {\n      events @paginated(perPage: 50, page: $page) {\n        data {\n          name\n          dailyVolume: usage(opts: { period: "hour", range: "day" }) {\n            total\n            data {\n              count\n            }\n          }\n        }\n        page {\n          page\n          totalPages\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventType($eventName: String, $environmentID: ID!) {\n    events(query: { name: $eventName, workspaceID: $environmentID }) {\n      data {\n        name\n        usage(opts: { period: "hour", range: "day" }) {\n          total\n          data {\n            slot\n            count\n          }\n        }\n        workflows {\n          id\n          slug\n          name\n          current {\n            createdAt\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEventType($eventName: String, $environmentID: ID!) {\n    events(query: { name: $eventName, workspaceID: $environmentID }) {\n      data {\n        name\n        usage(opts: { period: "hour", range: "day" }) {\n          total\n          data {\n            slot\n            count\n          }\n        }\n        workflows {\n          id\n          slug\n          name\n          current {\n            createdAt\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctionsUsage($environmentID: ID!, $page: Int, $archived: Boolean, $pageSize: Int) {\n    workspace(id: $environmentID) {\n      workflows(archived: $archived) @paginated(perPage: $pageSize, page: $page) {\n        page {\n          page\n          perPage\n          totalItems\n          totalPages\n        }\n        data {\n          id\n          slug\n          dailyStarts: usage(opts: { period: "hour", range: "day" }, event: "started") {\n            total\n            data {\n              count\n            }\n          }\n          dailyCompleted: usage(opts: { period: "hour", range: "day" }, event: "completed") {\n            total\n            data {\n              count\n            }\n          }\n          dailyCancelled: usage(opts: { period: "hour", range: "day" }, event: "cancelled") {\n            total\n            data {\n              count\n            }\n          }\n          dailyFailures: usage(opts: { period: "hour", range: "day" }, event: "errored") {\n            total\n            data {\n              count\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctionsUsage($environmentID: ID!, $page: Int, $archived: Boolean, $pageSize: Int) {\n    workspace(id: $environmentID) {\n      workflows(archived: $archived) @paginated(perPage: $pageSize, page: $page) {\n        page {\n          page\n          perPage\n          totalItems\n          totalPages\n        }\n        data {\n          id\n          slug\n          dailyStarts: usage(opts: { period: "hour", range: "day" }, event: "started") {\n            total\n            data {\n              count\n            }\n          }\n          dailyCompleted: usage(opts: { period: "hour", range: "day" }, event: "completed") {\n            total\n            data {\n              count\n            }\n          }\n          dailyCancelled: usage(opts: { period: "hour", range: "day" }, event: "cancelled") {\n            total\n            data {\n              count\n            }\n          }\n          dailyFailures: usage(opts: { period: "hour", range: "day" }, event: "errored") {\n            total\n            data {\n              count\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctions(\n    $environmentID: ID!\n    $page: Int\n    $archived: Boolean\n    $search: String\n    $pageSize: Int\n  ) {\n    workspace(id: $environmentID) {\n      workflows(archived: $archived, search: $search) @paginated(perPage: $pageSize, page: $page) {\n        page {\n          page\n          perPage\n          totalItems\n          totalPages\n        }\n        data {\n          appName\n          id\n          slug\n          name\n          isPaused\n          isArchived\n          current {\n            triggers {\n              eventName\n              schedule\n            }\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctions(\n    $environmentID: ID!\n    $page: Int\n    $archived: Boolean\n    $search: String\n    $pageSize: Int\n  ) {\n    workspace(id: $environmentID) {\n      workflows(archived: $archived, search: $search) @paginated(perPage: $pageSize, page: $page) {\n        page {\n          page\n          perPage\n          totalItems\n          totalPages\n        }\n        data {\n          appName\n          id\n          slug\n          name\n          isPaused\n          isArchived\n          current {\n            triggers {\n              eventName\n              schedule\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunction($slug: String!, $environmentID: ID!) {\n    workspace(id: $environmentID) {\n      id\n      workflow: workflowBySlug(slug: $slug) {\n        id\n        name\n        slug\n        isPaused\n        isArchived\n        appName\n        current {\n          triggers {\n            eventName\n            schedule\n            condition\n          }\n          deploy {\n            id\n            createdAt\n          }\n        }\n        failureHandler {\n          slug\n          name\n        }\n        configuration {\n          cancellations {\n            event\n            timeout\n            condition\n          }\n          retries {\n            value\n            isDefault\n          }\n          priority\n          eventsBatch {\n            maxSize\n            timeout\n            key\n          }\n          concurrency {\n            scope\n            limit {\n              value\n              isPlanLimit\n            }\n            key\n          }\n          rateLimit {\n            limit\n            period\n            key\n          }\n          debounce {\n            period\n            key\n          }\n          throttle {\n            burst\n            key\n            limit\n            period\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunction($slug: String!, $environmentID: ID!) {\n    workspace(id: $environmentID) {\n      id\n      workflow: workflowBySlug(slug: $slug) {\n        id\n        name\n        slug\n        isPaused\n        isArchived\n        appName\n        current {\n          triggers {\n            eventName\n            schedule\n            condition\n          }\n          deploy {\n            id\n            createdAt\n          }\n        }\n        failureHandler {\n          slug\n          name\n        }\n        configuration {\n          cancellations {\n            event\n            timeout\n            condition\n          }\n          retries {\n            value\n            isDefault\n          }\n          priority\n          eventsBatch {\n            maxSize\n            timeout\n            key\n          }\n          concurrency {\n            scope\n            limit {\n              value\n              isPlanLimit\n            }\n            key\n          }\n          rateLimit {\n            limit\n            period\n            key\n          }\n          debounce {\n            period\n            key\n          }\n          throttle {\n            burst\n            key\n            limit\n            period\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetFunctionUsage($id: ID!, $environmentID: ID!, $startTime: Time!, $endTime: Time!) {\n    workspace(id: $environmentID) {\n      workflow(id: $id) {\n        dailyStarts: usage(opts: { from: $startTime, to: $endTime }, event: "started") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyCancelled: usage(opts: { from: $startTime, to: $endTime }, event: "cancelled") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyCompleted: usage(opts: { from: $startTime, to: $endTime }, event: "completed") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyFailures: usage(opts: { from: $startTime, to: $endTime }, event: "errored") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetFunctionUsage($id: ID!, $environmentID: ID!, $startTime: Time!, $endTime: Time!) {\n    workspace(id: $environmentID) {\n      workflow(id: $id) {\n        dailyStarts: usage(opts: { from: $startTime, to: $endTime }, event: "started") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyCancelled: usage(opts: { from: $startTime, to: $endTime }, event: "cancelled") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyCompleted: usage(opts: { from: $startTime, to: $endTime }, event: "completed") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n        dailyFailures: usage(opts: { from: $startTime, to: $endTime }, event: "errored") {\n          period\n          total\n          data {\n            slot\n            count\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetProductionWorkspace {\n    defaultEnv {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n      webhookSigningKey\n    }\n  }\n'
): (typeof documents)['\n  query GetProductionWorkspace {\n    defaultEnv {\n      id\n      name\n      slug\n      parentID\n      test\n      type\n      createdAt\n      lastDeployedAt\n      isArchived\n      isAutoArchiveEnabled\n      webhookSigningKey\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Profile {\n    account {\n      name\n      marketplace\n    }\n  }\n'
): (typeof documents)['\n  query Profile {\n    account {\n      name\n      marketplace\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CancelRun($envID: UUID!, $runID: ULID!) {\n    cancelRun(envID: $envID, runID: $runID) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation CancelRun($envID: UUID!, $runID: ULID!) {\n    cancelRun(envID: $envID, runID: $runID) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query GetEventKeysForBlankSlate($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKeys(filter: { source: "key" }) {\n        name\n        presharedKey\n        createdAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query GetEventKeysForBlankSlate($environmentID: ID!) {\n    environment: workspace(id: $environmentID) {\n      ingestKeys(filter: { source: "key" }) {\n        name\n        presharedKey\n        createdAt\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RerunFunctionRun($environmentID: ID!, $functionID: ID!, $functionRunID: ULID!) {\n    retryWorkflowRun(\n      input: { workspaceID: $environmentID, workflowID: $functionID }\n      workflowRunID: $functionRunID\n    ) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation RerunFunctionRun($environmentID: ID!, $functionID: ID!, $functionRunID: ULID!) {\n    retryWorkflowRun(\n      input: { workspaceID: $environmentID, workflowID: $functionID }\n      workflowRunID: $functionRunID\n    ) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation Rerun($runID: ULID!, $fromStep: RerunFromStepInput) {\n    rerun(runID: $runID, fromStep: $fromStep)\n  }\n'
): (typeof documents)['\n  mutation Rerun($runID: ULID!, $fromStep: RerunFromStepInput) {\n    rerun(runID: $runID, fromStep: $fromStep)\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
