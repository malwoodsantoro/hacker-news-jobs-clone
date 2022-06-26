import React, { useEffect, useState } from 'react';

const getPostIDs = async () => {
  console.log('ok')
  const response = await fetch("https://hacker-news.firebaseio.com/v0/jobstories.json");
  const IDs = response.json();
  return IDs;
}

const getPost = async (ID) => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ID}.json`);
  const post = response.json();
  return post;
}

const fetchPosts = async (IDs) => {
  const posts = await Promise.all(
    IDs.map((id) => {
      return getPost(id);
    })
  );
  return posts;
};

const Jobs = () => {

  const [ids, setIDs] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const IDs = await getPostIDs();
      setIDs(ids);
      const showIDs = IDs.slice(0, 9);

      const showPosts = await fetchPosts(showIDs);
      console.log(showPosts)
      setPosts(showPosts);
    }

    getPosts();
  }, []);

  return (
    <div>
      <h1>Hacker News Jobs</h1>
      {posts.map(({ by, title}) => (
        <p key={by}>Coffee type {by} in a {title} size.</p>
      ))}
    </div>
  )
}

export default Jobs;