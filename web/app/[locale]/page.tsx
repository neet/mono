import { redirect } from "@/i18n/navigation";

export default async function HomePage(props: PageProps<"/[locale]">) {
  const { locale } = await props.params;

  return redirect({
    href: {
      pathname: "/tasks",
      query: { status: "pending" },
    },
    locale,
  });
}

