'use client';

import { useMutation } from 'urql';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { graphql } from '@/gql';
import { useEnvironment } from '@/queries';

const ArchiveEvent = graphql(`
  mutation ArchiveEvent($environmentId: ID!, $name: String!) {
    archiveEvent(workspaceID: $environmentId, name: $name) {
      name
    }
  }
`);

type ArchiveEventModalProps = {
  environmentSlug: string;
  eventName: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ArchiveEventModal({
  environmentSlug,
  eventName,
  isOpen,
  onClose,
}: ArchiveEventModalProps) {
  const [{ data: environment, fetching: isFetchingEnvironment }] = useEnvironment({
    environmentSlug,
  });
  const environmentId = environment?.id;
  const missingData = isFetchingEnvironment || !eventName || !environmentId;
  const [, archiveEvent] = useMutation(ArchiveEvent);

  return (
    <Modal className="flex max-w-xl flex-col gap-4" isOpen={isOpen} onClose={onClose}>
      <p className="pb-4">Are you sure you want to archive this event?</p>
      <div className="flex content-center justify-end">
        <Button variant="secondary" onClick={() => onClose()}>
          No
        </Button>
        <Button
          variant="text-danger"
          disabled={missingData}
          onClick={() => {
            !missingData && archiveEvent({ name: eventName, environmentId });
            !missingData && onClose();
          }}
        >
          Yes
        </Button>
      </div>
    </Modal>
  );
}
