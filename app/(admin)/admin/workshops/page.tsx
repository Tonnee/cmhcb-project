import { redirect } from "next/navigation";

export default function AdminWorkshopsRedirectPage(): never {
  redirect("/admin/events-workshops");
}
