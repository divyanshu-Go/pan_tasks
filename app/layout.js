import { Poppins } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { getUserProfile } from "@/lib/api/api";
// import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "PanTasks",
  description: "The Best Task Assigment Tool",
};


export default async function RootLayout({ children }) {
  const user = await getUserProfile();
  return (
    <html lang="en">
      <body className={`font-[Poppins] relative min-h-screen flex flex-col `}>
        
        <ClientLayout user={user}>{children}</ClientLayout>
        
      </body>
    </html>
  );
}
