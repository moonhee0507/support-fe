'use client'
 
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <Button className="h-20 rounded-xs px-10 has-[>svg]:px-8 text-xl" onClick={() => router.push('/clone')}>지원자 코드 다운로드</Button>
    </div>
  );
}
