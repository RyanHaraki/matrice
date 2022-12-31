import React from "react";
import Head from "next/head";

const Wrapper = ({ children }) => {
  return (
    <div>
      <Head>
        <meta
          property="og:title"
          content="Matrice | Sell Your Digital Products"
          key="title"
        />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          content="Sell your digital products and get paid what you deserve with instant payouts and low fees."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://usematrice.co/" />
        <meta property="og:image" content="./socialCard.png" />
        <meta name="twitter:title" content="Matrice " />
        <meta property="og:url" content="http://usematrice.co" />
        <meta
          name="twitter:description"
          content=" Sell your digital products, with instant payouts and low fees."
        />
        <meta name="twitter:image" content=" ./socialCard.png" />
        <meta name="twitter:card" content="./socialCard.png" />
        <meta name="twitter:site" content="@ryanharaki_" />
        <meta property="og:og:site_name" content="Matrice." />
        <meta name="twitter:image:alt" content="Matrice Twitter Card" />

        <title>Matrice | Sell your digital products</title>
      </Head>

      {children}
    </div>
  );
};

export default Wrapper;
