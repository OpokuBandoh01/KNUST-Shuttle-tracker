import Link from "next/link"
import { MapPin } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">KNUST Shuttle</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Terms of Service</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Last updated: June 10, 2024
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl space-y-8 mt-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to KNUST Shuttle Tracker. These Terms of Service ("Terms") govern your use of the KNUST
                  Shuttle Tracker mobile application and website (collectively, the "Service") operated by the KNUST
                  Shuttle Tracker Team ("we," "us," or "our").
                </p>
                <p className="text-muted-foreground">
                  By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part
                  of the Terms, you may not access the Service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">2. User Accounts</h2>
                <p className="text-muted-foreground">
                  When you create an account with us, you must provide accurate, complete, and current information.
                  Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your
                  account.
                </p>
                <p className="text-muted-foreground">
                  You are responsible for safeguarding the password that you use to access the Service and for any
                  activities or actions under your password.
                </p>
                <p className="text-muted-foreground">
                  You agree not to disclose your password to any third party. You must notify us immediately upon
                  becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">3. User Content</h2>
                <p className="text-muted-foreground">
                  Our Service allows you to post, link, store, share and otherwise make available certain information,
                  text, graphics, or other material ("Content"). You are responsible for the Content that you post on or
                  through the Service, including its legality, reliability, and appropriateness.
                </p>
                <p className="text-muted-foreground">
                  By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours
                  and/or you have the right to use it and the right to grant us the rights and license as provided in
                  these Terms, and (ii) that the posting of your Content on or through the Service does not violate the
                  privacy rights, publicity rights, copyrights, contract rights or any other rights of any person or
                  entity.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">4. Accuracy of Information</h2>
                <p className="text-muted-foreground">
                  The KNUST Shuttle Tracker Service provides real-time information about shuttle locations and estimated
                  arrival times. While we strive to ensure the accuracy of this information, we cannot guarantee that it
                  will always be 100% accurate or up-to-date.
                </p>
                <p className="text-muted-foreground">
                  Factors such as traffic, weather conditions, technical issues, or other unforeseen circumstances may
                  affect the accuracy of the information provided. Users should use the Service as a guide and allow for
                  reasonable variations in shuttle arrival times.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. Prohibited Uses</h2>
                <p className="text-muted-foreground">You agree not to use the Service:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>In any way that violates any applicable national or international law or regulation.</li>
                  <li>To impersonate or attempt to impersonate another user or person.</li>
                  <li>
                    To engage in any activity that interferes with or disrupts the Service (or the servers and networks
                    connected to the Service).
                  </li>
                  <li>
                    To attempt to gain unauthorized access to any portion of the Service or any other systems or
                    networks connected to the Service.
                  </li>
                  <li>
                    To harvest or collect email addresses or other contact information of other users from the Service.
                  </li>
                  <li>
                    To use the Service in a manner that could disable, overburden, damage, or impair the site or
                    interfere with any other party's use of the Service.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  The Service and its original content (excluding Content provided by users), features, and
                  functionality are and will remain the exclusive property of KNUST Shuttle Tracker and its licensors.
                  The Service is protected by copyright, trademark, and other laws of both Ghana and foreign countries.
                </p>
                <p className="text-muted-foreground">
                  Our trademarks and trade dress may not be used in connection with any product or service without the
                  prior written consent of KNUST Shuttle Tracker.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  In no event shall KNUST Shuttle Tracker, nor its directors, employees, partners, agents, suppliers, or
                  affiliates, be liable for any indirect, incidental, special, consequential or punitive damages,
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                  resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Your access to or use of or inability to access or use the Service;</li>
                  <li>Any conduct or content of any third party on the Service;</li>
                  <li>Any content obtained from the Service; and</li>
                  <li>Unauthorized access, use or alteration of your transmissions or content.</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">8. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                  revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                  What constitutes a material change will be determined at our sole discretion.
                </p>
                <p className="text-muted-foreground">
                  By continuing to access or use our Service after any revisions become effective, you agree to be bound
                  by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the
                  Service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">9. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed and construed in accordance with the laws of Ghana, without regard to
                  its conflict of law provisions.
                </p>
                <p className="text-muted-foreground">
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those
                  rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the
                  remaining provisions of these Terms will remain in effect.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">10. Offline Functionality</h2>
                <p className="text-muted-foreground">
                  The KNUST Shuttle Tracker app provides limited offline functionality. When offline, you may access
                  previously loaded timetables and route information, but real-time tracking and updates will not be
                  available. The app will automatically reconnect and update information when internet connectivity is
                  restored.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">11. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p className="text-muted-foreground">
                  Email: legal@knustshuttle.com
                  <br />
                  Phone: +233 123 456 789
                  <br />
                  Address: KNUST Transport Office, Kwame Nkrumah University of Science and Technology, Kumasi, Ghana
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">© 2024 KNUST Shuttle Tracker. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
