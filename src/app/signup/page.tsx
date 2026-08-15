import SignupForm from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <SignupForm />
      </div>
    </div>
  );
}
