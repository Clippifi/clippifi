import { Music, Scissors, Stamp, Video } from "@/components/icons";

const types = [
  {
    icon: Scissors,
    title: "Clipping",
    text: "Creators cut the best moments from your podcast, stream or long video into short clips.",
  },
  {
    icon: Music,
    title: "Sound",
    text: "Creators post videos that use your song or sound, so it spreads across feeds.",
  },
  {
    icon: Stamp,
    title: "Logo",
    text: "Creators add your logo or watermark to their own content for steady brand exposure.",
  },
  {
    icon: Video,
    title: "UGC",
    text: "Creators film original videos about your product in their own style.",
  },
];

export default function CampaignTypes() {
  return (
    <section id="campaigns" className="scroll-mt-20 bg-slate-50 py-20 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-balance text-slate-900 sm:text-4xl dark:text-white">Four kinds of campaigns</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Every campaign pays creators for the views their clips get.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {types.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-card bg-white p-6 shadow-sm shadow-slate-100 dark:bg-[#111] dark:shadow-none">
              <span className="flex h-11 w-11 items-center justify-center rounded-inner bg-brand-400 text-slate-900">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
