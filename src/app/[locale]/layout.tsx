import ReduxProvider from "../../components/module/_basic/reduxProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full h-full">
      <ReduxProvider>{children}</ReduxProvider>
    </main>
  );
}
