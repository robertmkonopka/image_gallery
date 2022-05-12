import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Admin() {
  const [isSubmitting, setIsSubmitting] = useState();
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();
  const [successMessage, setSuccessMessage] = useState(
    "Image was successfully uploaded!"
  );

  const router = useRouter();

  /**
   * handleOnChange
   * Triggers when the file input changes (ex: when a file is selected)
   */
  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }

  /**
   * handleOnSubmit
   * Triggers when the main form is submitted
   */
  async function handleOnSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );
    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "robert-uploads");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/konocoding/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    setImageSrc(data.secure_url);
    setUploadData(data);
    setIsSubmitting(false);
  }

  return (
    <div>
      <Head>
        <title>Gallery K | Upload an Image!</title>
        <meta name="description" content="Upload your image!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 60,
          }}
        >
          <button
            onClick={() => {
              Cookies.remove("token");
              router.push("/");
            }}
          >
            Logout
          </button>
        </div>
        <h1 className={styles.title}>Image Uploader</h1>

        <p className={styles.description}>Upload your image below</p>

        <form
          className={styles.form}
          method="post"
          onChange={handleOnChange}
          onSubmit={handleOnSubmit}
        >
          <p>
            <input type="file" name="file" />
          </p>

          {imageSrc && <img src={imageSrc} />}

          {imageSrc && !uploadData && (
            <p>
              <button>{isSubmitting ? "Uploading..." : "Upload File"}</button>
            </p>
          )}

          {uploadData && <div>{successMessage}</div>}
        </form>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const token = context.req.cookies["token"];

  // If there is a valid cookie and that cookie decodes to the user
  if (token) {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      decoded.username === process.env.ADMIN_USERNAME &&
      decoded.password === process.env.ADMIN_PASSWORD
    ) {
      return {
        props: {},
      };
    }
  }

  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
  };
}
