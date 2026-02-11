import { PageLayout } from '@/components/core/page_layout';

export default function PrivacyPolicyPage() {
    return (
        <PageLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-semibold text-blue-600 mb-4">
                            Privacy Policy
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Empowering your voice while protecting your data.
                        </p>
                    </div>
                </div>

                <div className="space-y-10 mx-auto">

                    <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Our Commitment</h2>
                        <p className="text-gray-600 leading-relaxed text-base">
                            Common Ground is a platform built on trust and community engagement. We respect your privacy and aim to be fully transparent about the data we collect and why. Our goal is to gather only the information necessary to improve our service while protecting your anonymity.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">What We Collect and Why</h2>
                        <p className="text-gray-600 leading-relaxed text-base">
                            To understand how our platform is being used and to make it better, we use Vercel Analytics. This is a privacy-first analytics tool that helps us see general traffic trends without tracking individuals.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-base">
                            Here’s what Vercel Analytics collects during your visit:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-base">
                            <li className="text-gray-600 leading-relaxed"><strong className="font-medium text-gray-900">Pageviews:</strong> The pages you visit on our site.</li>
                            <li className="text-gray-600 leading-relaxed"><strong className="font-medium text-gray-900">Device Type:</strong> Whether you are visiting from a desktop, tablet, or mobile device.</li>
                            <li className="text-gray-600 leading-relaxed"><strong className="font-medium text-gray-900">Country of Origin:</strong> The country you are visiting from. Your specific location or IP address is never recorded.</li>
                            <li className="text-gray-600 leading-relaxed"><strong className="font-medium text-gray-900">Referring Site:</strong> The website that linked you to ours (e.g., Google, Twitter, etc.).</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">What We DO NOT Collect</h2>
                        <p className="text-gray-600 leading-relaxed text-base">
                            Vercel Analytics is designed to be privacy-friendly. It <strong className="font-semibold text-gray-700">does not use cookies</strong> and <strong className="font-semibold text-gray-700">does not track you</strong> as you browse other websites. We do not collect any personally identifiable information for analytics purposes.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-base">
                            The data we gather is aggregated and used solely for the purpose of improving our platform. It cannot be used to identify or create a profile on you.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Changes to This Policy</h2>
                        <p className="text-gray-600 leading-relaxed text-base">
                            We may update this policy from time to time to reflect changes in our practices. Any updates will be posted on this page. This policy was last updated on October 21, 2025.
                        </p>
                    </div>

                </div>
            </div>
        </PageLayout>
    );
}
