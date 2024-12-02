import { ScrollArea } from '@/components/ui/scroll-area';
import UserForm from './user-form';
import PageContainer from '@/components/layout/page-container';

export default function EmployeeViewPage() {
  return (
    <PageContainer>
      <UserForm />
    </PageContainer>
  );
}
