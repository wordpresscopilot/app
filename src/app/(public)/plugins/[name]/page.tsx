import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { plugins } from "@/constants/plugins";
import Image from "next/image";

export default function PluginPage({ params }: { params: { name: string } }) {
  const decodedName = decodeURIComponent(params.name);
  const plugin = plugins.find((plugin) => plugin.name === decodedName);

  if (!plugin) {
    return <div>Plugin not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{plugin.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image src={plugin.img} alt={plugin.name} width={100} height={100} />
      </CardContent>
    </Card>
  );
}
