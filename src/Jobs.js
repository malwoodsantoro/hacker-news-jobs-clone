import React, { useEffect, useState } from 'react';

const getPostIDs = async () => {
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

  const [ids, setIDs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postIndex, setpostIndex] = useState(0);

  //index to set to nine on useEffect and then bump with eah load more

  useEffect(() => {
    const getPosts = async () => {
      const IDs = await getPostIDs();
      setIDs(IDs);
      const showIDs = IDs.slice(0, 9);

      const showPosts = await fetchPosts(showIDs);
      setpostIndex(9);
      setPosts(showPosts);
    }

    getPosts();
  }, []);

  const loadMore = async () => {
    const newIndex = postIndex + 9
    const newPosts = await fetchPosts(ids.slice(postIndex, newIndex))
    setPosts(posts.concat(newPosts))
    setpostIndex(newIndex)
  }

  const toDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US")
  }

  return (
    <div>
      <h1>Hacker News Jobs</h1>
      <div className="container">
        {posts.map(({ by, title, time, url, id }) => (
          <a className="fillDiv" href={url ? url : `https://news.ycombinator.com/item?id=${id}`}>
            <div className="post">
              <h2>{title.split(')')[0] + ')'}</h2>
              <p>{title.split(')')[1]}</p>
              <p>{new Date(time * 1000).toLocaleDateString("en-US")}</p>
            </div>
          </a>
        ))}
      </div>
      <button className="load" onClick={loadMore}>Load more</button>
    </div>

  )
}

export default Jobs;