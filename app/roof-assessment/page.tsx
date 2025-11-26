"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { ArrowRight, CheckCircle2, Phone, MapPin, Calendar as CalendarIcon } from "lucide-react"
import { format, isWeekend, addDays, startOfDay } from "date-fns"

type Step = "questions" | "calendar" | "contact" | "success"

export default function RoofAssessmentPage() {
  const [step, setStep] = useState<Step>("questions")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    roofType: "",
    urgency: "",
    website: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formLoadTime] = useState(Date.now())

  const today = startOfDay(new Date())
  const tomorrow = addDays(today, 1)

  const isDateDisabled = (date: Date) => {
    const dateStart = startOfDay(date)
    const todayStart = startOfDay(new Date())
    return (
      isWeekend(date) ||
      dateStart.getTime() <= todayStart.getTime()
    )
  }

  const handleQuestionsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("calendar")
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date && !isDateDisabled(date)) {
      setSelectedDate(date)
    }
  }

  const handleCalendarNext = () => {
    if (selectedDate) {
      setStep("contact")
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/roof-assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          email: "",
          city: "",
          state: "",
          zipCode: "",
          message: `Roof Type: ${formData.roofType || "Not specified"}\nUrgency: ${formData.urgency || "Not specified"}\nPreferred Date: ${selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Not specified"}`,
          website: formData.website,
          formLoadTime,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit request")
      }

      setStep("success")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert(error instanceof Error ? error.message : "Failed to submit request. Please try again or contact us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <main className="relative min-h-screen bg-background">
      <div className="relative min-h-[500px] w-full overflow-hidden flex items-center justify-center pt-24 pb-16 bg-white">
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center">
            <Image
              src="/SCRlogo.JPG"
              alt="Stuart Conrad Roofing"
              width={300}
              height={150}
              className="h-auto w-auto max-w-[300px]"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-red-800 mb-6 text-balance">
            Book a Roof Assessment
            <br />
            <span className="text-black/100">with Us Today</span>
          </h1>
          <p className="text-xl text-black/80 max-w-2xl mx-auto">
            Get a professional roof inspection from our experienced team. We offer 24-48 hour inspections.
          </p>
        </div>
      </div>

      <section className="relative py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="glass-dark rounded-3xl p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-white mb-6">Why Choose Us?</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Expert Inspection</p>
                      <p className="text-white/60 text-sm">Professional assessment by certified roofers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Free Estimates</p>
                      <p className="text-white/60 text-sm">No obligation, transparent pricing</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">Quick Response</p>
                      <p className="text-white/60 text-sm">24-48 hour inspection availability</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/20">
                  <h3 className="text-white font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-white/60" />
                      <a href="tel:5133800592" className="text-white/80 text-sm hover:text-white transition-colors">
                        (513) 380-0592
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-white/60 mt-0.5" />
                      <span className="text-white/80 text-sm">
                        Stuart Conrad Roofing Services<br />
                        13 W Main St<br />
                        Amelia, OH 45102
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="glass-dark rounded-3xl p-8 lg:p-12">
                {step === "questions" && (
                  <form onSubmit={handleQuestionsSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-6">Tell Us About Your Roof</h2>
                    </div>
                    <div>
                      <Label htmlFor="roofType" className="text-white mb-2 block">
                        What type of roof do you have?
                      </Label>
                      <select
                        id="roofType"
                        name="roofType"
                        value={formData.roofType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <option value="" className="bg-black text-white">Select roof type...</option>
                        <option value="asphalt" className="bg-black text-white">Asphalt Shingles</option>
                        <option value="metal" className="bg-black text-white">Metal</option>
                        <option value="tile" className="bg-black text-white">Tile</option>
                        <option value="slate" className="bg-black text-white">Slate</option>
                        <option value="flat" className="bg-black text-white">Flat Roof</option>
                        <option value="other" className="bg-black text-white">Other</option>
                        <option value="unknown" className="bg-black text-white">Not Sure</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="urgency" className="text-white mb-2 block">
                        How urgent is your inspection?
                      </Label>
                      <select
                        id="urgency"
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50"
                      >
                        <option value="" className="bg-black text-white">Select urgency...</option>
                        <option value="urgent" className="bg-black text-white">Urgent - Need inspection ASAP</option>
                        <option value="soon" className="bg-black text-white">Soon - Within the next week</option>
                        <option value="flexible" className="bg-black text-white">Flexible - Anytime works</option>
                      </select>
                    </div>
                    <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
                      <Label htmlFor="website" className="text-white mb-2 block">
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        type="text"
                        value={formData.website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
                    >
                      Continue to Select Date
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                )}

                {step === "calendar" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Select Your Preferred Date</h2>
                      <p className="text-white/60 text-sm mb-6">
                        We offer 24-48 hour inspections. Please select a date at least one day in advance (weekdays only).
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-white/5 rounded-lg p-6 border border-white/10 relative w-fit min-w-[320px]">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={isDateDisabled}
                          className="rounded-md [&_.rdp-month_caption]:pt-2 [&_.rdp-month_caption]:pb-2 [&_.rdp-month_caption]:text-center [&_.rdp-table]:w-full [&_.rdp-weekday]:w-[calc(100%/7)] [&_.rdp-day]:w-[calc(100%/7)] [&_.rdp-weekdays]:hidden"
                          classNames={{
                            day: "text-white",
                            day_selected: "bg-white text-black",
                            day_disabled: "text-white/30 cursor-not-allowed",
                            month_caption: "text-white text-center",
                            weekday: "text-white/60",
                            table: "w-full",
                            weekdays: "hidden",
                            week: "flex w-full",
                          }}
                        />
                      </div>
                    </div>
                    {selectedDate && (
                      <div className="text-center">
                        <p className="text-white/80 mb-4">
                          Selected date: <span className="font-semibold text-white">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                        </p>
                      </div>
                    )}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setStep("questions")}
                        size="lg"
                        className="flex-1 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 px-8 h-14 text-base font-semibold"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCalendarNext}
                        disabled={!selectedDate}
                        size="lg"
                        className="flex-1 rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === "contact" && (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Enter Your Information</h2>
                      <p className="text-white/60 text-sm mb-6">
                        Selected date: <span className="font-semibold text-white">{selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}</span>
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="name" className="text-white mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white mb-2 block">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        placeholder="(513) 555-0100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-white mb-2 block">
                        Street Address *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={() => setStep("calendar")}
                        size="lg"
                        className="flex-1 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 px-8 h-14 text-base font-semibold"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="flex-1 rounded-full bg-white text-black hover:bg-white/90 px-8 h-14 text-base font-semibold"
                      >
                        {isSubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            Submit Request
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {step === "success" && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Thank You!</h3>
                    <p className="text-white/60 mb-2">
                      Your roof assessment request has been submitted.
                    </p>
                    <p className="text-white/60 text-sm">
                      Look out for a call from us within the next 24 hours to confirm your appointment.
                    </p>
                    {selectedDate && (
                      <p className="text-white/80 text-sm mt-4">
                        Scheduled for: <span className="font-semibold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
