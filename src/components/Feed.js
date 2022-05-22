import React, { useEffect, useState } from 'react'
import Post from './Post';
import axios from 'axios';
import useAuth from '../context/AuthContext';
import Status from './Status';
import CircularProgress from '@mui/material/CircularProgress';
import ListRequest from './ListRequest';
import InfiniteScroll from "react-infinite-scroll-component";

const Feed = ({ socket }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [length, setLength] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingPost, setFetchingPost] = useState(true);
  axios.defaults.baseURL = "http://localhost:5000";
  const config = {
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${user.accessToken}`
    },
  };
  const getListPost = async (active) => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`/api/posts?page=${page}`, config);
      const listPost = data.list;
      const arr = [...posts, ...listPost];
      if (active) {
        setPosts(arr);
        if (listPost.length === 0 || listPost.length < 10) {
          setHasMore(false);
        }
        setLength(listPost.total);
        setPage(page + 1);

      }
      setFetchingPost(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let active = true;
    getListPost(active);
    return () => {
      active = false;
    };
  }, [])
  return (
    <div className='row justify-content-center mt-2'>
      <div className='col-md-7'>
        <div className='row'>
          <div className='col-md-8'>
            {/* dang bai */}
            <Status updateList={getListPost} setPosts={setPosts} />
            {isLoading &&
              <div className='row justify-content-center'>
                <div className='col-md-3'>
                  <CircularProgress />
                </div>
              </div>}
            <InfiniteScroll style={{ "width": "100%", "overflow": "none" }}
              dataLength={length}
              next={getListPost}
              hasMore={hasMore} loader={<div className='row justify-content-center'>
                <div className='col-md-3'>
                  <CircularProgress />
                </div>
              </div>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Đã hết tin</b>
                </p>
              }>
              {posts.map((e, i) => (
                <Post key={i} post={e} socket={socket} setPosts={setPosts} posts={posts} />
              ))}

            </InfiniteScroll>

            {/* post */}
          </div>
          <div className='col-md-4'>
            <ListRequest socket={socket} />
          </div>
        </div>
      </div>
    </div>

  )
}

export default Feed