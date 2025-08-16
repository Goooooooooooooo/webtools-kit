// app/page.tsx
import { Suspense } from 'react';
import ToolList from '@/app/ToolList';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Suspense 包裹客户端组件 */}
      <Suspense fallback={<div className="text-center py-20">加载中...</div>}>
        <ToolList />
      </Suspense>
    </div>
  );
}