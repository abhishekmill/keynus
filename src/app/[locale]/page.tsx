import { redirect } from "../../navigation";

export default function Home() {
  redirect("/auth/login");
}
