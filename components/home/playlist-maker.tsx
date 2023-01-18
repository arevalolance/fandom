import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Popover from "../shared/popover";
import PopoverItem from "../shared/popover-item";
import { PromptResult } from "../../lib/types";

const PlaylistMaker = ({
  setPromptResults,
  isLoading,
  setLoading,
}: {
  setPromptResults: Dispatch<SetStateAction<PromptResult[]>>;
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [item, setItem] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string>("");

  const prompt = `List five songs. Number-based list. The list should not include songs from its soundtrack. Use this as a reference for its theme. Explain why you chose that song based on the story in one sentence:${search}`;

  const generate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSearch("");
    setLoading(true);

    const response = await fetch(`/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let tempState = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const newValue = decoder
        .decode(value)
        .replaceAll("data: ", "")
        .split("\n\n")
        .filter(Boolean);

      if (tempState) {
        newValue[0] = tempState + newValue[0];
        tempState = "";
      }

      newValue.forEach((newVal) => {
        if (newVal === "[DONE]") {
          return;
        }

        try {
          const json = JSON.parse(newVal) as {
            id: string;
            object: string;
            created: number;
            choices?: {
              text: string;
              index: number;
              logprobs: null;
              finish_reason: null | string;
            }[];
            model: string;
          };

          if (!json.choices?.length) {
            throw new Error("Something went wrong.");
          }

          const choice = json.choices[0];
          setGeneratedText((prev) => prev + choice.text);
        } catch (error) {
          tempState = newVal;
        }
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      const songs: PromptResult[] = [];
      const results = generatedText
        .split(/(\d+\.)/)
        .filter(Boolean)
        .filter((_, i) => i % 2 !== 0);
      results.splice(0, 1); // hack for now to remove first element "\n\n"
      results.forEach((item) => {
        let data = item.split(/(: | - )/);
        let songArtistPair = data[0].split(" by ");
        let description = data[2];

        songs.push({
          song: songArtistPair[0],
          artist: songArtistPair[1],
          description: description,
        });
      });

      setPromptResults(songs);
    }
  }, [generatedText, isLoading, setPromptResults]);

  return (
    <div className="flex w-10/12 flex-col items-center gap-x-2 gap-y-2 md:flex-row">
      <input
        onChange={(e) => setSearch(e.target.value)}
        className="h-[42px] w-full rounded-md border-[1px] border-gray-300 py-1 px-2 focus:border-none"
        required
        placeholder="It Starts With Us"
        maxLength={35}
      />

      <button
        onClick={(e) => generate(e)}
        disabled={isLoading}
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white drop-shadow-md hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 md:w-fit"
      >
        {isLoading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
};

export default PlaylistMaker;
