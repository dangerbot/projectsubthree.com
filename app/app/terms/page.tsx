import Link from "next/link";
import type { Metadata } from "next";
import MarketingNav from "../components/MarketingNav";

export const metadata: Metadata = {
  title: "Terms of Use — Project Sub Three",
  description:
    "Terms of use for the Project Sub Three prototype. Read before you use the companion app.",
};

export default function Terms() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingNav />
      <article className="max-w-[680px] mx-auto px-6 pt-14 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Terms of Use
        </h1>
        <p className="text-sm text-muted mb-12">
          Last updated: June 2026 · Please read before continuing.
        </p>

        <Section title="What this is">
          Project Sub Three is a personal prototype — an experiment in
          AI-native consumer product. It is not a finished, supported, or
          commercial product. You&apos;re using it because you were invited or
          stumbled in, and we&apos;re glad you&apos;re here. By using it, you
          accept that it&apos;s early and rough around the edges.
        </Section>

        <Section title="What we collect">
          To make the companion work, we store the email address you sign in
          with and the running context, plans, and conversation you share with
          the AI. That data lives in a Supabase project under our control. We
          don&apos;t sell it, share it, or use it for advertising. We do send
          your chat messages to Anthropic (Claude) so the AI can respond —
          that&apos;s the whole product.
        </Section>

        <Section title="What this is not">
          This is software, not a coach, not a doctor, and not a medical
          device. Nothing here is medical or training advice. Marathon
          training is physically demanding — please consult an actual
          professional before starting, changing, or intensifying any
          training program. If something the companion suggests feels wrong
          for your body, trust your body.
        </Section>

        <Section title="What we don't guarantee">
          Everything. The app may break, change without notice, lose data, or
          be taken down entirely. Features available today may disappear
          tomorrow. We make no warranties of any kind, express or implied,
          including fitness for any particular purpose, accuracy of training
          recommendations, or uptime.
        </Section>

        <Section title="Your data">
          You can ask us to delete your account and everything tied to it at
          any time. Email{" "}
          <a
            href="mailto:steve@projectsubthree.com"
            className="text-accent hover:underline"
          >
            steve@projectsubthree.com
          </a>{" "}
          with the address you signed up with and we&apos;ll take care of it.
        </Section>

        <Section title="Liability">
          You use this prototype at your own risk. To the maximum extent
          permitted by law, we&apos;re not liable for any injury, loss, lost
          data, missed races, or any other harm arising from your use of the
          app. If you can&apos;t accept that, please don&apos;t use it — and
          please know it isn&apos;t personal.
        </Section>

        <Section title="Changes">
          We may update these terms as the prototype evolves. Material changes
          will be flagged on the login screen. Continued use after an update
          means you accept the new terms.
        </Section>

        <p className="text-sm text-muted-light mt-16">
          Questions? Reach out:{" "}
          <a
            href="mailto:steve@projectsubthree.com"
            className="text-accent hover:underline"
          >
            steve@projectsubthree.com
          </a>
        </p>

        <div className="mt-16 pt-8 border-t border-border/50">
          <Link
            href="/companion"
            className="inline-flex items-center text-[13px] font-semibold tracking-[0.12em] uppercase text-foreground hover:text-accent transition"
          >
            Continue to the app →
          </Link>
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-3">
        {title}
      </h2>
      <p className="text-base font-light leading-[1.75] text-foreground/85">
        {children}
      </p>
    </section>
  );
}
