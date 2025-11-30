import { useLoginForm } from "@hooks/auth/useAuth";
import logoDataVise from "@assets/logo-datavise.svg";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@stores/user";
import { ROUTES } from "@/core/constants/routes";
import { Button, GuestLayout, InputField } from "@datavise/ui";

export default function Login() {
  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.token);

  if (user && token) {
    return <Navigate to={ROUTES.dashboards} replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    onSubmit,
    globalError,
    loading,
  } = useLoginForm();

  return (
    <GuestLayout
      title="Conecter vous à Data-Vise"
      logoUrl={logoDataVise}

    >
      {globalError && (
        <div
          className="mb-4 p-3 rounded bg-red-100 text-red-700 border border-red-300 text-sm text-center
        dark:bg-red-900 dark:text-red-300 dark:border-red-700 transition-colors duration-300
        "
        >
          {globalError}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <InputField
          placeholder="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          className="py-4!"
        />
        <InputField
          placeholder="Mot de passe"
          type="password"
          {...register("password")}
          error={errors.password?.message}
          className="py-4!"
        />
        <Button
          type="submit"
          color="indigo"
          size="md"
          variant="solid"
          loading={loading}
          disabled={loading}
        >
          Se connecter
        </Button>

        <div className="text-center mt-4">
          <a href={ROUTES.register} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
            Pas encore de compte ? S'inscrire
          </a>
        </div>
      </form>
    </GuestLayout>
  );
}
