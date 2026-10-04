import { redirect } from "next/navigation";
import { authenticate } from "@/lib/auth";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const result = await authenticate(email, password);
    if (!result.ok) {
      redirect("/admin/login?error=1");
    }
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-2xl font-display font-semibold mb-2">Ceylon Elite Tours</h1>
        <p className="text-gray-500 mb-8">Sign in to the control center</p>

        {searchParams.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-6 text-sm">
            Invalid email or password.
          </div>
        )}

        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="admin@ceylonelitetours.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              defaultValue="admin123"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white rounded px-4 py-2 mt-4 hover:bg-gray-800 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
