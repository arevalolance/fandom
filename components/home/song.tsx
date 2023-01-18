import {
  FADE_DOWN_ANIMATION_VARIANTS,
  FADE_UP_ANIMATION_VARIANTS,
} from "@/lib/constants";
import { PromptResult, Song } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import Balancer from "react-wrap-balancer";
import Image from "next/image";
import { useEffect, useState } from "react";
import Play from "../shared/icons/play";
import Pause from "../shared/icons/pause";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { LoadingSpinner } from "../shared/icons";

const SongCard = ({ res }: { res: PromptResult }) => {
  const [song, setSong] = useState<Song | null>(null);
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { data, isLoading } = useSWR<Song>(
    `api/spotify?song=${res.song.split("by")[0]}`,
    fetcher,
  );

  useEffect(() => {
    if (data) {
      setSong(data);
    }
  }, [data]);

  useEffect(() => {
    if (song) {
      setAudio(new Audio(song?.preview));
    }
  }, [song]);

  useEffect(() => {
    if (playing) {
      audio!.volume = 0.2;
      audio?.play();
    } else {
      audio?.pause();
    }
  }, [audio, playing]);

  return (
    <AnimatePresence>
      <div className="flex w-full flex-col-reverse  items-center justify-between gap-y-4 rounded-lg bg-white p-8 drop-shadow-md sm:flex-row">
        <div className="flex w-8/12 flex-col items-center sm:items-start">
          <Balancer className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent md:text-2xl md:font-normal">
            {res.song}
          </Balancer>
          <motion.p
            className="text-md mt-2 w-full text-center text-gray-500 sm:mt-6 sm:text-left"
            variants={FADE_DOWN_ANIMATION_VARIANTS}
          >
            <Balancer>{res.description}</Balancer>
          </motion.p>
        </div>
        {song ? (
          <motion.div
            className="relative h-[150px] w-[150px]"
            variants={FADE_UP_ANIMATION_VARIANTS}
          >
            <Image
              className="rounded-md drop-shadow-md"
              src={song.image}
              alt={res.song}
              width={150}
              height={150}
            />
            <motion.button
              className="absolute right-0 bottom-0 mr-2 mb-2 rounded-full border-2 border-gray-300 bg-gray-100 p-1"
              onClick={() => setPlaying(!playing)}
              whileTap={{ rotate: 100 }}
              whileHover={{ scale: 1.1 }}
            >
              {playing ? (
                <Pause className="text-gradient-to-br h-[30px] w-[30px] from-black to-stone-500" />
              ) : (
                <Play className="text-gradient-to-br h-[30px] w-[30px] from-black to-stone-500" />
              )}
            </motion.button>
          </motion.div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </AnimatePresence>
  );
};

export default SongCard;
