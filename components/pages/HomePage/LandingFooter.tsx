export default function LandingFooter() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center text-sm text-muted-foreground md:flex-row md:text-left">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded bg-primary text-xs text-primary-foreground">
            39
          </div>
          <span>
            &copy; {new Date().getFullYear()} 39T. All rights reserved.
          </span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
