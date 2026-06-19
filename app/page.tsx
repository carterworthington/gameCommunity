import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 px-4">
      <div className="max-w-md w-full text-center text-white">
        <h1 className="text-5xl font-bold mb-4">GameCommunity</h1>
        <p className="text-xl mb-8 text-blue-100">
          Find friends and discover games to play together
        </p>
        <div className="space-y-3">
          <Link href="/auth/login" className="block w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition text-center">
            Sign In
          </Link>
          <Link href="/auth/register" className="block w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-400 transition text-center">
            Create Account
          </Link>
        </div>
        <p className="text-sm text-blue-100 mt-6">
          Coming soon: Connect with friends, log games, and find people to play with
        </p>
      </div>
    </div>
  );
}
