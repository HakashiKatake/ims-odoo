import { redirect } from 'next/navigation';

export default async function Home() {
  // Redirect all users to the landing page
  redirect('/landingpage');
}

