'use client';

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export default function NotFound() {
  const { darkMode } = useAppContext();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <h1 className="text-4xl font-bold mb-4">功能未上线。</h1>
      <p className="mb-6">不定时更新。。。</p>
      <Link href="/" className="btn btn-primary">返回首页</Link>
    </div>
  );
}