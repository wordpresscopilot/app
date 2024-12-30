import Marquee from "@/components/magicui/marquee";

const logos = ["next.svg", "anthropic.svg", "assistantui.png", "wordpress.png"];

export default function Logos() {
  return (
    <section id="logos">
      <div className="container mx-auto px-4 md:px-8">
        {/* <h3 className="text-center text-sm font-semibold text-gray-500">
          POWERED BY BEST IN CLASS AI TOOLING
        </h3> */}
        <div className="relative my-6">
          <Marquee className="max-w-full [--duration:12s]">
            {logos.map((logo, idx) => (
              <img
                key={idx}
                height={32}
                width={120}
                src={`/logos/${logo}`}
                className={`h-18 w-[120px] object-contain dark:brightness-0 dark:invert grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-300 mx-4`}
                alt={logo}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
