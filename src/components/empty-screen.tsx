export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to Your WordPress AI Agent!
        </h1>
        <p className="leading-normal text-muted-foreground">
          This powerful AI assistant is designed to revolutionize your WordPress
          experience. It can help you with a variety of tasks, including:
        </p>
        <ul className="list-disc list-inside leading-normal text-muted-foreground mt-2">
          <li>Developing custom WordPress code and plugins</li>
          <li>Creating engaging blog posts and content</li>
          <li>Fetching and exporting WordPress data efficiently</li>
        </ul>
        <p className="leading-normal text-muted-foreground mt-4">
          Whether you are a developer looking to streamline your coding process,
          a content creator in need of inspiration, or a site manager wanting to
          optimize your data handling, this AI agent is here to assist you every
          step of the way.
        </p>
        <p className="leading-normal text-muted-foreground mt-2">
          Get started by asking a question or specifying a task related to your
          WordPress site!
        </p>
      </div>
    </div>
  );
}
