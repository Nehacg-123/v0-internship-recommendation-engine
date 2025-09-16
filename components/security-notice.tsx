"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react"
import { useLanguage } from "./language-provider"

export function SecurityNotice() {
  const { t } = useLanguage()

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Shield className="w-5 h-5" />
          Security & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Secure Authentication</h4>
              <p className="text-xs text-muted-foreground">
                Your passwords are encrypted and protected with industry-standard security measures.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Privacy Protection</h4>
              <p className="text-xs text-muted-foreground">
                Your personal information is never shared with third parties without consent.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-sm">Rate Limiting</h4>
              <p className="text-xs text-muted-foreground">
                Multiple failed attempts are automatically blocked to prevent abuse.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            This platform implements CSRF protection, input validation, secure headers, and comprehensive logging to
            ensure your data remains safe and secure.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
