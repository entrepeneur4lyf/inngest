'use client';

import { useState } from 'react';
import { type Route } from 'next';
import { useRouter } from 'next/navigation';
import { Button, NewButton } from '@inngest/components/Button';
import { Modal } from '@inngest/components/Modal';
import { RiAddLine } from '@remixicon/react';
import { toast } from 'sonner';
import { useMutation } from 'urql';

import { useEnvironment } from '@/components/Environments/environment-context';
import { useBooleanFlag } from '@/components/FeatureFlags/hooks';
import Input from '@/components/Forms/Input';
import { OptionalTooltip } from '@/components/Navigation/OptionalTooltip';
import { graphql } from '@/gql';
import { defaultTransform } from './[keyID]/TransformEvent';
import useManagePageTerminology from './useManagePageTerminology';

const CreateSourceKey = graphql(`
  mutation NewIngestKey($input: NewIngestKey!) {
    key: createIngestKey(input: $input) {
      id
    }
  }
`);

export default function CreateKeyButton() {
  const [inputValue, setInputValue] = useState<string>('');
  const [isModalOpen, setModalOpen] = useState(false);
  const currentContent = useManagePageTerminology();
  const environment = useEnvironment();
  const [{ fetching }, createSourceKey] = useMutation(CreateSourceKey);
  const router = useRouter();
  const newIANav = useBooleanFlag('new-ia-nav');

  if (!currentContent) {
    return null;
  }

  function handleClick() {
    if (currentContent && inputValue) {
      let transform = undefined;
      if (currentContent.type === 'webhook') {
        // We must specify a transform, otherwise the webhook will be in a
        // broken state due to a missing transform. It might be better to
        // specify the default transform in the backend, but this is a quick fix
        transform = defaultTransform;
      }

      createSourceKey({
        input: {
          filterList: null,
          workspaceID: environment.id,
          name: inputValue,
          source: currentContent.type,
          metadata: {
            transform,
          },
        },
      }).then((result) => {
        if (result.error) {
          toast.error(`${currentContent.name} could not be created`);
        } else {
          toast.success(`${currentContent.name} was successfully created`);
          router.refresh();

          const newKeyID = result.data?.key.id;
          if (newKeyID) {
            router.push(
              `/env/${environment.slug}/manage/${currentContent.param}/${newKeyID}` as Route
            );
          }
        }
      });
    }
  }

  return (
    <>
      <OptionalTooltip
        tooltip={environment.isArchived && 'Cannot create key. Environment is archived'}
      >
        {newIANav.isReady && !newIANav.value ? (
          <Button
            icon={<RiAddLine />}
            btnAction={() => setModalOpen(true)}
            disabled={environment.isArchived}
            kind="primary"
            label={`Create ${currentContent.name}`}
          />
        ) : (
          <NewButton
            icon={<RiAddLine />}
            onClick={() => setModalOpen(true)}
            disabled={environment.isArchived}
            kind="primary"
            label={`Create ${currentContent.name}`}
          />
        )}
      </OptionalTooltip>

      <Modal
        isOpen={isModalOpen}
        className={'w-1/4'}
        onClose={() => setModalOpen(false)}
        title={`Create a New ${currentContent.name}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button
              appearance="outlined"
              label="Cancel"
              btnAction={() => {
                setModalOpen(false);
              }}
            />
            <Button
              kind="primary"
              label="Create"
              loading={fetching}
              btnAction={() => {
                handleClick();
                setModalOpen(false);
              }}
              disabled={!inputValue}
            />
          </div>
        }
      >
        <div className="p-6">
          <Input
            name="keyName"
            placeholder={`${currentContent.name} Name`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </Modal>
    </>
  );
}
