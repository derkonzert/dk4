import { useEffect, useState } from "react";
import { Nullable } from "typescript-nullable";
import { supabase } from "../utils/supabaseClient";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { Flex } from "./Flex";

export default function AvatarUpload({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState<Nullable<string>>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .getPublicUrl(path);
      if (error) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data.publicURL);
      }
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Flex align="center" gap="4">
      {avatarUrl ? (
        <Avatar src={avatarUrl} size="large" />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      <div style={{ width: size }}>
        <Button as="label" variant="secondary" htmlFor="single">
          {uploading ? "Uploading ..." : "Change Profile Image"}
        </Button>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </Flex>
  );
}
