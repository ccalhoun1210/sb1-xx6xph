import { useState } from "react";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addYears, isAfter } from "date-fns";

interface Warranty {
  type: "standard" | "extended";
  startDate: Date;
  endDate: Date;
  coverage: string[];
  claimHistory: {
    date: Date;
    description: string;
    approved: boolean;
  }[];
}

interface WarrantyTrackerProps {
  serialNumber: string;
  purchaseDate: string;
  onUpdate: (warranty: Warranty) => void;
}

export function WarrantyTracker({
  serialNumber,
  purchaseDate,
  onUpdate,
}: WarrantyTrackerProps) {
  const [warranty, setWarranty] = useState<Warranty>({
    type: "standard",
    startDate: new Date(purchaseDate),
    endDate: addYears(new Date(purchaseDate), 1),
    coverage: [
      "Motor Assembly",
      "Main Housing",
      "Electrical Components",
      "Water Basin",
    ],
    claimHistory: [],
  });

  const isWarrantyValid = isAfter(warranty.endDate, new Date());

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Clock className="mr-2 h-4 w-4" />
          Warranty Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Warranty Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Serial Number</Label>
              <Input value={serialNumber} disabled />
            </div>
            <div className="space-y-2">
              <Label>Purchase Date</Label>
              <Input value={format(new Date(purchaseDate), "PP")} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Warranty Type</Label>
              <Select
                value={warranty.type}
                onValueChange={(value: "standard" | "extended") => {
                  const endDate =
                    value === "extended"
                      ? addYears(new Date(purchaseDate), 2)
                      : addYears(new Date(purchaseDate), 1);
                  setWarranty({ ...warranty, type: value, endDate });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (1 Year)</SelectItem>
                  <SelectItem value="extended">Extended (2 Years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Warranty Status</Label>
              <div
                className={`p-2 rounded-md ${
                  isWarrantyValid
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isWarrantyValid ? "Active" : "Expired"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Coverage Details</Label>
            <div className="grid grid-cols-2 gap-2">
              {warranty.coverage.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 p-2 bg-muted rounded-md"
                >
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Claim History</Label>
            <div className="space-y-2">
              {warranty.claimHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No warranty claims filed
                </p>
              ) : (
                warranty.claimHistory.map((claim, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-2 border rounded-md"
                  >
                    <div>
                      <p className="font-medium">
                        {format(claim.date, "PP")}
                      </p>
                      <p className="text-sm">{claim.description}</p>
                    </div>
                    <span
                      className={`text-sm ${
                        claim.approved
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {claim.approved ? "Approved" : "Denied"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {!isWarrantyValid && (
            <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-800 rounded-md">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">
                Warranty has expired. Consider offering a service contract or
                extended warranty.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}