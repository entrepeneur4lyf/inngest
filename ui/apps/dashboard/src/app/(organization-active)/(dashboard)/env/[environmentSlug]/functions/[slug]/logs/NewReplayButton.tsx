'use client';

import { useState } from 'react';

import NewReplayModal from '@/app/(organization-active)/(dashboard)/env/[environmentSlug]/functions/[slug]/logs/NewReplayModal';

type NewReplayButtonProps = {
  functionSlug: string;
};

export default function NewReplayButton({ functionSlug }: NewReplayButtonProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <NewReplayModal
      isOpen={isModalVisible}
      functionSlug={functionSlug}
      onClose={() => setIsModalVisible(false)}
    />
  );
}
