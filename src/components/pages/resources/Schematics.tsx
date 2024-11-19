import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const schematics = [
  {
    id: 1,
    title: "SRX Motor Assembly",
    category: "Motor",
    model: "SRX",
    schematicUrl: "/schematics/srx-motor.pdf",
    lastUpdated: "2024-02-15",
  },
  {
    id: 2,
    title: "E2 Black Power Nozzle",
    category: "Power Nozzle",
    model: "E2 Black",
    schematicUrl: "/schematics/e2-power-nozzle.pdf",
    lastUpdated: "2024-01-20",
  },
  // Add more schematics
]

export default function ResourceSchematics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Technical Schematics</h2>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search schematics..." className="pl-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schematics.map((schematic) => (
          <Card key={schematic.id} className="cursor-pointer hover:bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">{schematic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Category: {schematic.category}
                </div>
                <div className="text-sm text-muted-foreground">
                  Model: {schematic.model}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Updated: {new Date(schematic.lastUpdated).toLocaleDateString()}
                </div>
                <a
                  href={schematic.schematicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Schematic
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}