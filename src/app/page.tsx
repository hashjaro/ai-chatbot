import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">AI Chatbot</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Welcome to Sidemate, your AI-powered chatbot, built with Next.js and xAI.
      </p>
      <Link
        href="/chat"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Start Chatting
      </Link>
    </div>
  );
}