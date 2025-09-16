"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Award, ArrowRight } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"
import { AIChatbot } from "@/components/ai-chatbot"
import { useLanguage } from "@/components/language-provider"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">{t("home.title")}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Button variant="outline" asChild>
                <Link href="/login">{t("common.login")}</Link>
              </Button>
              <Button asChild>
                <Link href="/register">{t("common.register")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">{t("home.heroTitle")}</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">{t("home.heroDescription")}</p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/register">
              {t("home.getStarted")} <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">{t("home.howItWorks")}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{t("home.createProfile")}</CardTitle>
                <CardDescription>{t("home.createProfileDesc")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{t("home.getMatched")}</CardTitle>
                <CardDescription>{t("home.getMatchedDesc")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{t("home.applySucceed")}</CardTitle>
                <CardDescription>{t("home.applySucceedDesc")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h3 className="text-3xl font-bold text-foreground mb-6">{t("home.readyToStart")}</h3>
          <p className="text-lg text-muted-foreground mb-8">{t("home.joinThousands")}</p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/register">
              {t("home.createYourProfile")} <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">{t("home.footerText")}</p>
        </div>
      </footer>

      <AIChatbot />
    </div>
  )
}
