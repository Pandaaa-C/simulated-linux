import ShellPage from "@/components/ShellPage";
import { cn } from "@/lib/utils";

export default async function Dashboard() {
  return (
    <div className={cn("min-h-screen")}>
      <ShellPage />
    </div>
  );
}
