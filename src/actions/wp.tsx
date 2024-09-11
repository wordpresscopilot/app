export async function executeWordPressSQL({
  query,
  api_key,
  api_url,
}: {
  query: string;
  api_key: string;
  api_url: string;
}): Promise<string> {
  try {
    const response = await fetch(`${api_url}?api_key=${api_key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error executing WordPress SQL:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
