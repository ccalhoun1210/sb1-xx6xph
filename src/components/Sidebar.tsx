import { Link, useLocation } from "react-router-dom"
import { 
  Wrench, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  BookOpen,
  ShieldCheck,
  Boxes,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Sidebar() {
  const location = useLocation()
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)
  const { user } = useAuth()
  
  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between min-h-screen">
      <nav className="space-y-8">
        <div className="flex items-center space-x-2">
          <Wrench className="w-6 h-6" />
          <span className="text-xl font-semibold whitespace-nowrap">Rainbow Workshop</span>
        </div>
        <div className="space-y-2">
          {user?.role === "technician" ? (
            <Link to="/technician">
              <div className={cn(
                "flex items-center space-x-2 p-2 rounded transition-colors",
                isActive("/technician") ? "bg-gray-800" : "hover:bg-gray-800/50"
              )}>
                <Users className="w-5 h-5" />
                <span>Technician Portal</span>
              </div>
            </Link>
          ) : (
            <>
              <Link to="/work-orders">
                <div className={cn(
                  "flex items-center space-x-2 p-2 rounded transition-colors",
                  isActive("/work-orders") ? "bg-gray-800" : "hover:bg-gray-800/50"
                )}>
                  <FileText className="w-5 h-5" />
                  <span>Work Orders</span>
                </div>
              </Link>
              <Link to="/customers">
                <div className={cn(
                  "flex items-center space-x-2 p-2 rounded transition-colors",
                  isActive("/customers") ? "bg-gray-800" : "hover:bg-gray-800/50"
                )}>
                  <Users className="w-5 h-5" />
                  <span>Customers</span>
                </div>
              </Link>
              <Link to="/customer-machines">
                <div className={cn(
                  "flex items-center space-x-2 p-2 rounded transition-colors",
                  isActive("/customer-machines") ? "bg-gray-800" : "hover:bg-gray-800/50"
                )}>
                  <Boxes className="w-5 h-5" />
                  <span>Customer Rainbows</span>
                </div>
              </Link>
              <Link to="/inventory">
                <div className={cn(
                  "flex items-center space-x-2 p-2 rounded transition-colors",
                  isActive("/inventory") ? "bg-gray-800" : "hover:bg-gray-800/50"
                )}>
                  <Package className="w-5 h-5" />
                  <span>Inventory</span>
                </div>
              </Link>

              <Link to="/admin">
                <div className={cn(
                  "flex items-center space-x-2 p-2 rounded transition-colors",
                  isActive("/admin") ? "bg-gray-800" : "hover:bg-gray-800/50"
                )}>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Admin Suite</span>
                </div>
              </Link>

              <Collapsible
                open={isResourcesOpen}
                onOpenChange={setIsResourcesOpen}
                className="space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between space-x-2 p-2 font-normal",
                      isActive("/resources") || isResourcesOpen ? "bg-gray-800" : "hover:bg-gray-800/50"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5" />
                      <span>Resources</span>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isResourcesOpen ? "rotate-180" : ""
                    )} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-6">
                  <Link to="/resources/manuals">
                    <div className={cn(
                      "flex items-center space-x-2 p-2 rounded transition-colors text-sm",
                      isActive("/resources/manuals") ? "bg-gray-800" : "hover:bg-gray-800/50"
                    )}>
                      <span>How-to Manuals</span>
                    </div>
                  </Link>
                  <Link to="/resources/videos">
                    <div className={cn(
                      "flex items-center space-x-2 p-2 rounded transition-colors text-sm",
                      isActive("/resources/videos") ? "bg-gray-800" : "hover:bg-gray-800/50"
                    )}>
                      <span>Videos</span>
                    </div>
                  </Link>
                  <Link to="/resources/schematics">
                    <div className={cn(
                      "flex items-center space-x-2 p-2 rounded transition-colors text-sm",
                      isActive("/resources/schematics") ? "bg-gray-800" : "hover:bg-gray-800/50"
                    )}>
                      <span>Schematics</span>
                    </div>
                  </Link>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}

          <Link to="/settings">
            <div className={cn(
              "flex items-center space-x-2 p-2 rounded transition-colors",
              isActive("/settings") ? "bg-gray-800" : "hover:bg-gray-800/50"
            )}>
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </Link>
        </div>
      </nav>
      <div className="text-xs text-gray-400 mt-auto pt-6 text-center">
        © 2024 Lux Air, LLC<br />
        in partnership with<br />
        Kairos Marketing, LLC<br />
        All rights reserved.
      </div>
    </aside>
  )
}