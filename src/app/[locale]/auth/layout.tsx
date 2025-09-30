import AuthLayout from "../../../components/layout/auth/authLayout";

export default function LockerWallLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthLayout>{children}</AuthLayout>
    </>
  );
}
