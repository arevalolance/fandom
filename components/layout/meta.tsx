import Head from "next/head";

const DOMAIN = "https://precedent.dev";

export default function Meta({
  title = "Fandom - Unleash the Playlist of Your Fandom",
  description = "Create Custom Playlists from Your Favorite Books, Movies, and TV Shows",
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:logo" content={`${DOMAIN}/logo.png`}></meta>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content="https://fandom-rho.vercel.app/screenshot.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vercel" />
      <meta name="twitter:creator" content="@arevalolance" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        property="og:image"
        content="https://fandom-rho.vercel.app/screenshot.png"
      />
    </Head>
  );
}
