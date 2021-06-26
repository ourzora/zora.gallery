import axios from "axios"; // Requests
import client from "./index"; // GraphQL requests
import { ZORA_MEDIA_BY_ID } from "./queries"; // GraphQL Queries

/**
 * Collect Zora media post by ID
 * @param {Number} id post number
 * @returns {Object} containing Zora media details
 */
 export const getPostByID = async (id) => {
  // Collect post
  let post = await client.request(ZORA_MEDIA_BY_ID(id));
  post = post.media;

  // Collect post metadata
  let metadata = {
    data: {}
  };
  // Post metadata will be null if request fails
  try {
    metadata = await axios.get(post.metadataURI);
  } catch (e) {
    console.log(e)
  }
  post.metadata = metadata.data;

  // Only show Zora posts
  if (post.metadata.version !== "zora-20210101") {
    return undefined;
  }

  // If text media, collect post content
  if (metadata.data.mimeType.startsWith("text")) {
    const text = await axios.get(post.contentURI);
    post.contentURI = text.data;
  }

  // Return post
  return post;
};