import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { UniversityProvider } from "./contexts/UniversityContext";
import Dashboard from "./pages/Dashboard";
import UniversityDetail from "./pages/UniversityDetail";
import UniversitiesList from "./pages/UniversitiesList";
import { useState } from "react";

function Router() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "detail" | "list">("dashboard");
  const [selectedUniversityId, setSelectedUniversityId] = useState<string | undefined>();

  return (
    <Switch>
      <Route path="/" >
        {currentPage === "dashboard" ? (
          <Dashboard
            onAddUniversity={() => {
              setSelectedUniversityId(undefined);
              setCurrentPage("detail");
            }}
            onViewUniversity={(id) => {
              setSelectedUniversityId(id);
              setCurrentPage("detail");
            }}
            onBrowseUniversities={() => setCurrentPage("list")}
          />
        ) : currentPage === "list" ? (
          <UniversitiesList
            onBack={() => setCurrentPage("dashboard")}
            onViewUniversity={(id) => {
              setSelectedUniversityId(id);
              setCurrentPage("detail");
            }}
          />
        ) : (
          <UniversityDetail
            universityId={selectedUniversityId}
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <UniversityProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UniversityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
