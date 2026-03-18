import { ThemeProvider } from "next-themes";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Toaster } from "./components/ui/sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserRole } from "./hooks/useQueries";
import AdminDashboard from "./pages/AdminDashboard";
import BookingPage from "./pages/BookingPage";

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userRole } = useGetCallerUserRole();

  const isAuthenticated = !!identity;
  const isAdmin = userRole === "admin";

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {isAuthenticated && isAdmin ? <AdminDashboard /> : <BookingPage />}
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
