"use server"

// * currently not using the root route

import { redirect } from 'next/navigation'
export default async function Home() {
  return redirect("/videos");
}
