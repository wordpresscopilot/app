export async function executeWordPressSQL({
  query,
  api_key = "wpsage_test_key_123",
  api_url = "https://wpsage-1cd140.ingress-haven.ewp.live/wp-json/wpsage/v1/run-sql",
}: {
  query: string;
  api_key: string;
  api_url: string;
}): Promise<string> {
  try {
    console.log({
      query,
      api_key,
      api_url,
    });
    const response = await fetch(
      `${"https://wpsage-1cd140.ingress-haven.ewp.live/wp-json/wpsage/v1/run-sql"}?api_key=${api_key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("data", data);
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("Error executing WordPress SQL:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
