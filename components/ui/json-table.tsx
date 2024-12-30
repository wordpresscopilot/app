"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";
import React from "react";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface JsonTableProps {
  data: JsonValue[] | string;
}

const JsonTable: React.FC<JsonTableProps> = ({ data }) => {
  const [parsedData, setParsedData] = React.useState<JsonValue[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setParsedData(parsed);
        } else {
          setParsedData([parsed]);
          setError("Parsed data is not an array, but we'll display it anyway");
        }
      } catch (e) {
        setParsedData([{ data }]);
      }
    } else if (Array.isArray(data)) {
      setParsedData(data);
    } else {
      setParsedData([data]);
      setError(
        "Data is neither a string nor an array, but we'll display it anyway"
      );
    }
    setIsLoading(false);
  }, [data]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (parsedData.length === 0) {
    return <p>No data to display</p>;
  }

  const headers = Object.keys(parsedData[0] as object);

  const renderValue = (value: JsonValue): React.ReactNode => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const exportToCSV = () => {
    const csvContent = [
      headers.join(","),
      ...parsedData.map((item) =>
        headers
          .map((header) =>
            JSON.stringify((item as { [key: string]: JsonValue })[header])
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      {error && <p className="text-yellow-500 mb-2">{error}</p>}
      <div className="mb-4 flex justify-start items-center gap-4">
        <Button
          size="icon"
          onClick={exportToCSV}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
        </Button>
        <div className="text-sm text-muted-foreground">
          {parsedData.length} row{parsedData.length !== 1 ? "s" : ""} |{" "}
          {headers.length} column{headers.length !== 1 ? "s" : ""}
        </div>
      </div>
      <div className="rounded-md border max-h-[600px] overflow-auto">
        <div className="max-w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead
                    key={header}
                    className="font-bold sticky top-0 bg-background z-10 whitespace-nowrap"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {parsedData.map((item, index) => (
                <TableRow key={index} className={index % 2 === 0 ? "" : ""}>
                  {headers.map((header) => (
                    <TableCell
                      key={`${index}-${header}`}
                      className="whitespace-nowrap"
                    >
                      {renderValue(
                        (item as { [key: string]: JsonValue })[header]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default function JSONArrayTable({ data }: { data: any }) {
  return <JsonTable data={data} />;
}
