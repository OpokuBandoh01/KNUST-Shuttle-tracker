import Link from "next/link"
import { MapPin } from "lucide-react"

export default function PrivacyPage() {
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Privacy Policy</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Last updated: June 10, 2024
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-3xl space-y-8 mt-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">1. Introduction</h2>
                <p className="text-muted-foreground">
                  KNUST Shuttle Tracker ("we", "our", or "us") is committed to protecting your privacy. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile
                  application and website (collectively, the "Service").
                </p>
                <p className="text-muted-foreground">
                  Please read this Privacy Policy carefully. By using the Service, you agree to the collection and use
                  of information in accordance with this policy. If you do not agree with our policies and practices, do
                  not use our Service.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold">2.1 Personal Information</h3>
                <p className="text-muted-foreground">We may collect personally identifiable information, such as:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Student ID number</li>
                  <li>Program of study</li>
                  <li>Year of study</li>
                </ul>

                <h3 className="text-xl font-semibold">2.2 Location Data</h3>
                <p className="text-muted-foreground">
                  To provide real-time shuttle tracking, our Service collects location data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    For users: We collect your location data when you use the app to provide relevant shuttle
                    information near you.
                  </li>
                  <li>For drivers: We collect continuous location data to update shuttle positions on the map.</li>
                </ul>
                <p className="text-muted-foreground">
                  You can disable location services through your device settings, but this may limit certain features of
                  the Service.
                </p>

                <h3 className="text-xl font-semibold">2.3 Usage Data</h3>
                <p className="text-muted-foreground">
                  We may also collect information that your browser or device sends whenever you visit our Service or
                  when you access the Service by or through a mobile device ("Usage Data").
                </p>
                <p className="text-muted-foreground">
                  This Usage Data may include information such as your computer's Internet Protocol address, browser
                  type, browser version, the pages of our Service that you visit, the time and date of your visit, the
                  time spent on those pages, unique device identifiers and other diagnostic data.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">3. How We Use Your Information</h2>
                <p className="text-muted-foreground">We use the collected data for various purposes:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our Service</li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                  <li>
                    To provide you with news, special offers and general information about other goods, services and
                    events which we offer
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">4. Data Retention</h2>
                <p className="text-muted-foreground">
                  We will retain your Personal Information only for as long as is necessary for the purposes set out in
                  this Privacy Policy. We will retain and use your Personal Information to the extent necessary to
                  comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
                </p>
                <p className="text-muted-foreground">
                  We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a
                  shorter period of time, except when this data is used to strengthen the security or to improve the
                  functionality of our Service, or we are legally obligated to retain this data for longer time periods.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">5. Data Security</h2>
                <p className="text-muted-foreground">
                  The security of your data is important to us, but remember that no method of transmission over the
                  Internet, or method of electronic storage is 100% secure. While we strive to use commercially
                  acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                </p>
                <p className="text-muted-foreground">
                  We implement a variety of security measures to maintain the safety of your personal information when
                  you enter, submit, or access your personal information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All sensitive information is transmitted via Secure Socket Layer (SSL) technology</li>
                  <li>All data is stored in secure database environments</li>
                  <li>Access to personal information is restricted to authorized personnel only</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">6. Disclosure of Data</h2>
                <h3 className="text-xl font-semibold">6.1 Legal Requirements</h3>
                <p className="text-muted-foreground">
                  We may disclose your Personal Information in the good faith belief that such action is necessary to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To comply with a legal obligation</li>
                  <li>To protect and defend the rights or property of KNUST Shuttle Tracker</li>
                  <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                  <li>To protect the personal safety of users of the Service or the public</li>
                  <li>To protect against legal liability</li>
                </ul>

                <h3 className="text-xl font-semibold">6.2 Service Providers</h3>
                <p className="text-muted-foreground">
                  We may employ third-party companies and individuals to facilitate our Service ("Service Providers"),
                  to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing
                  how our Service is used.
                </p>
                <p className="text-muted-foreground">
                  These third parties have access to your Personal Information only to perform these tasks on our behalf
                  and are obligated not to disclose or use it for any other purpose.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">7. Your Data Protection Rights</h2>
                <p className="text-muted-foreground">You have the following data protection rights:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Access:</strong> You can request copies of your personal information.
                  </li>
                  <li>
                    <strong>Rectification:</strong> You can request that we correct inaccurate information about you.
                  </li>
                  <li>
                    <strong>Erasure:</strong> You can request that we delete your personal information in certain
                    circumstances.
                  </li>
                  <li>
                    <strong>Restrict processing:</strong> You can request that we restrict the processing of your
                    information in certain circumstances.
                  </li>
                  <li>
                    <strong>Data portability:</strong> You can request that we transfer your information to another
                    organization or directly to you.
                  </li>
                  <li>
                    <strong>Object to processing:</strong> You can object to our processing of your personal
                    information.
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  To exercise any of these rights, please contact us at privacy@knustshuttle.com.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">8. Children's Privacy</h2>
                <p className="text-muted-foreground">
                  Our Service is not intended for use by children under the age of 18. We do not knowingly collect
                  personally identifiable information from children under 18. If you are a parent or guardian and you
                  are aware that your child has provided us with Personal Information, please contact us. If we become
                  aware that we have collected Personal Information from children without verification of parental
                  consent, we take steps to remove that information from our servers.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">9. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy
                  Policy.
                </p>
                <p className="text-muted-foreground">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                  Policy are effective when they are posted on this page.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">10. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <p className="text-muted-foreground">
                  Email: privacy@knustshuttle.com
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
