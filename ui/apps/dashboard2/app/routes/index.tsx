import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Component,
});

function Component() {
  return 'Home';
}
