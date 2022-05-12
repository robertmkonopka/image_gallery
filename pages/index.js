import Head from "next/head";

var cloudinary = require("cloudinary");

export default function Index(props) {
  const { response } = props;

  return (
    <div>
      <Head>
        <title>{"Robert Konopka"}</title>
        <meta name="description" content="Image Gallery App" />
      </Head>

      <h1 className="title" style={{ marginTop: 36 }}>
        Robert Konopka
      </h1>

      <blockquote
        style={{
          maxWidth: 800,
          margin: "0 auto",
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        Hi, {`I'm`} Robert Konopka, aspiring software engineer. Welcome to my
        image portfolio gallery! I created this app with HTML5, CSS3, and
        Javascript! The page regenerates programmatically whenever I upload new
        content from the{" "}
        <a
          href="/admin"
          style={{
            color: "#276df1",
          }}
        >
          Admin Portal (/admin)
        </a>
        , using cookie-based authentication.{" "}
        <a
          target="_blank"
          href="demo.mp4"
          style={{
            color: "#276df1",
          }}
        >
          Click here for a demo of the admin upload experience!
        </a>
      </blockquote>

      <div className="grid">
        {response.resources.map(function (element) {
          return <img key={element.url} src={element.url}></img>;
        })}
      </div>
    </div>
  );
}

// getStaticProps is a Node.js function that only runs at "build" time
export async function getStaticProps() {
  // Configure Cloudinary SDK with my credentials
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // add your cloud_name
    api_key: process.env.CLOUDINARY_API_KEY, // add your api_key
    api_secret: process.env.CLOUDINARY_API_SECRET, // add your api_secret
    secure: true,
  });

  const response = await cloudinary.v2.api.resources({
    max_results: 500,
  });

  // Incompatible serialization issue
  delete response.rate_limit_reset_at;

  return {
    props: {
      response,
    },
    revalidate: 86400, // One day, in seconds
  };
}
