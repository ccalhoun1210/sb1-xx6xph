import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const manuals = [
  {
    id: 1,
    title: "SRX Service Manual",
    category: "Service",
    model: "SRX",
    fileUrl: "/manuals/srx-service.pdf",
  },
  {
    id: 2,
    title: "E2 Black Repair Guide",
    category: "Repair",
    model: "E2 Black",
    fileUrl: "/manuals/e2-black-repair.pdf",
  },
  // Add more manuals
]

export default function ResourceManuals() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Service Manuals</h2>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search manuals..." className="pl-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {manuals.map((manual) => (
          <Card key={manual.id} className="cursor-pointer hover:bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">{manual.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Category: {manual.category}
                </div>
                <div className="text-sm text-muted-foreground">
                  Model: {manual.model}
                </div>
                <a
                  href={manual.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download PDF
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}