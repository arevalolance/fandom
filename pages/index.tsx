import Card from "@/components/home/card";
import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { AnimatePresence, motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Github, Twitter } from "@/components/shared/icons";
import PlaylistMaker from "@/components/home/playlist-maker";
import { useState } from "react";
import { PromptResult } from "@/lib/types";
import SongCard from "@/components/home/song";

export default function Home() {
  const [promptResults, setPrompResults] = useState<PromptResult[]>([]);
  const [isLoading, setLoading] = useState(false);

  return (
    <Layout>
      <motion.div
        className="max-w-xl px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.a
          variants={FADE_DOWN_ANIMATION_VARIANTS}
          href="https://twitter.com/arevalolance"
          target="_blank"
          rel="noreferrer"
          className="mx-auto mb-5 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
        >
          <Twitter className="h-5 w-5 text-[#1d9bf0]" />
          <p className="text-sm font-semibold text-[#1d9bf0]">@arevalolance</p>
        </motion.a>
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>Unleash the Playlist of Your Fandom</Balancer>
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>
            Create Custom Playlists from Your Favorite Books, Movies, and TV
            Shows
          </Balancer>
        </motion.p>
        <motion.div
          className="mx-auto mt-6 flex items-center justify-center space-x-5"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm text-gray-600 shadow-md transition-colors hover:border-gray-800"
            href="https://github.com/arevalolance/fandom"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>Star on GitHub</p>
          </a>
        </motion.div>
      </motion.div>
      {/* here we are animating with Tailwind instead of Framer Motion because Framer Motion messes up the z-index for child components */}
      <div className="my-10 w-11/12 animate-[slide-down-fade_0.5s_ease-in-out] bg-red-200 md:w-[768px]">
        <Card
          title={
            isLoading ? "Finding your songs..." : "Create your own Playlist"
          }
          description={
            isLoading
              ? "Wait a moment while we find you the perfect list of songs"
              : "Create a playlist from your favorite books, movies, and TV shows"
          }
          demo={
            <PlaylistMaker
              setLoading={setLoading}
              isLoading={isLoading}
              setPromptResults={setPrompResults}
            />
          }
        />
      </div>

      {!isLoading && promptResults.length > 0 ? (
        <div className="z-10 my-10 w-11/12 animate-[slide-down-fade_0.5s_ease-in-out] md:w-[768px]">
          <AnimatePresence>
            <motion.h1
              className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-3xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:leading-[5rem]"
              variants={FADE_DOWN_ANIMATION_VARIANTS}
            >
              <Balancer>Here&apos;s your playlist</Balancer>
            </motion.h1>
          </AnimatePresence>
          <div className="flex flex-col gap-y-4">
            {promptResults.map((item) => (
              <SongCard key={item.song} res={item} />
            ))}
          </div>
        </div>
      ) : null}
    </Layout>
  );
}
