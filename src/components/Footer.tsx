export default function Footer() {
  return (
    <footer className="border-t py-8 mt-16">
      <div className="container text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} 1StepAhead. All rights reserved.
      </div>
    </footer>
  );
}
