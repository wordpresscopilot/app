export async function executeWordPressSQL({
  query,
  api_key,
  api_url,
}: {
  query: string;
  api_key: string;
  api_url: string;
}): Promise<any> {
  try {
    console.log({
      query,
      api_key,
      api_url,
    });
    console.log("`${api_url}?c=${api_key}`", `${api_url}?api_key=${api_key}`);
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${api_key}`,
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        status: response.status,
        ok: response.ok,
        error: errorData || {
          message: `HTTP error! status: ${response.status}`,
        },
      };
    }

    const data = await response.json();
    return {
      status: response.status,
      ok: response.ok,
      data,
      error: undefined,
    };
  } catch (error) {
    console.error("Error executing WordPress SQL:", error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
