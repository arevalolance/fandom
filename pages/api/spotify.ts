import { getAccessToken } from "@/lib/spotify";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import jwt from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET as string;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { song } = req.query;
    const session: any = await getSession({ req });
    const accessToken = session?.accessToken;
    const { access_token } = await getAccessToken(accessToken);

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${song}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const data = await response.json();

    if (data.error) {
      res.status(400).json({ error: data.error.message });
      return;
    }

    const item = data.tracks.items[0];

    res.status(200).json({
      id: item.id,
      title: item.name,
      image: item.album.images[0].url,
      preview: item.preview_url,
      artists: item.artists.map((artist: any) => artist.name),
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export default handler;
