import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const videos = [
  {
    id: 1,
    title: "SRX Motor Replacement Guide",
    category: "Repair",
    model: "SRX",
    thumbnailUrl: "https://example.com/thumbnail1.jpg",
    videoUrl: "https://example.com/video1.mp4",
    duration: "15:30",
  },
  {
    id: 2,
    title: "E2 Black Maintenance Tips",
    category: "Maintenance",
    model: "E2 Black",
    thumbnailUrl: "https://example.com/thumbnail2.jpg",
    videoUrl: "https://example.com/video2.mp4",
    duration: "08:45",
  },
  // Add more videos
]

export default function ResourceVideos() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Service Videos</h2>
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search videos..." className="pl-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="cursor-pointer hover:bg-gray-50">
            <CardHeader className="relative pb-0">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 rounded text-sm">
                {video.duration}
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Category: {video.category}
                </div>
                <div className="text-sm text-muted-foreground">
                  Model: {video.model}
                </div>
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Watch Video
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}