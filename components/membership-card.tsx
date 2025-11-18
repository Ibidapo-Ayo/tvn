"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import type { User } from "@/types/types"
import Image from "next/image"

interface MembershipCardProps {
  member: User
  showActions?: boolean
}

export function MembershipCard({ member, showActions = true }: MembershipCardProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const cardContent = document.getElementById(`membership-card-${member.id}`)?.innerHTML
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Membership Card - ${member.name}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none !important; }
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
            }
          </style>
        </head>
        <body>
          ${cardContent}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleDownload = async () => {
    // In a real implementation, you would use html2canvas or similar library
    // to convert the card to an image and trigger download
    alert("Download functionality requires html2canvas library. This is a placeholder.")
  }

  return (
    <div className="space-y-4">
      <div id={`membership-card-${member.id}`}>
        {/* Front of Card */}
        <Card className="w-[350px] h-[220px] bg-[#5C2D91] p-6 text-white relative overflow-hidden shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white transform translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white transform -translate-x-12 translate-y-12" />
          </div>

          {/* Card Content */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide">The Visionary Nation</h3>
                <p className="text-xs opacity-90">Member ID Card</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                <Image
                  src="/tha_logo.png"
                  alt="TVN Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Member Info */}
            <div className="flex gap-4 flex-1">
              {/* Photo */}
              <div className="w-20 h-24 bg-white rounded-lg overflow-hidden shrink-0">
                {member.passportPhoto ? (
                  <img
                    src={member.passportPhoto}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                    No Photo
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-1">
                <div>
                  <p className="text-xs opacity-75">Name</p>
                  <p className="font-semibold text-sm leading-tight">{member.name}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75">Member ID</p>
                  <p className="font-mono text-sm font-bold tracking-wide">{member.membershipId}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="opacity-75">Community</p>
                    <p className="font-medium">{member.community}</p>
                  </div>
                  <div>
                    <p className="opacity-75">Dept</p>
                    <p className="font-medium truncate">{member.department}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end text-xs">
              <div>
                <p className="opacity-75">Issue Date</p>
                <p className="font-medium">{new Date(member.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right opacity-75">
                <p>We roar, we soar</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Back of Card */}
        <Card className="w-[350px] h-[220px] bg-white border-2 border-primary/20 p-6 mt-4 relative overflow-hidden">
          <div className="h-full flex flex-col justify-between">
            {/* Important Information */}
            <div className="space-y-3">
              <div className="text-center border-b pb-2">
                <h4 className="font-bold text-primary">Important Information</h4>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Gender:</p>
                  <p className="font-medium capitalize">{member.gender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date of Birth:</p>
                  <p className="font-medium">{new Date(member.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone:</p>
                  <p className="font-medium">{member.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">State:</p>
                  <p className="font-medium">{member.stateOfResidence}</p>
                </div>
              </div>

              {/* Signature */}
              <div className="border-t pt-2">
                <p className="text-xs text-muted-foreground mb-1">Member's Signature:</p>
                {member.signature ? (
                  <div className="h-12 flex items-center">
                    <img
                      src={member.signature}
                      alt="Signature"
                      className="h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-12 border-b border-dashed border-gray-300" />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground border-t pt-2">
              <p>This card is the property of The Visionary Nation</p>
              <p>If found, please return to any TVN location</p>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-xs text-gray-400 text-center">
              QR<br />Code
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex gap-2 no-print">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Print Card
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Card
          </Button>
        </div>
      )}
    </div>
  )
}

