import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;


// import React, { Suspense } from 'react';
// import { useLoaderData, Await } from 'react-router-dom';
// import Filter from '../../components/filter/Filter';
// import Card from '../../components/card/Card';
// import Map from '../../components/map/Map';
// import './listPage.scss';

// const PostList = ({ posts }) => (
//   <>
//     {posts.map((post) => (
//       <Card key={post.id} item={post} />
//     ))}
//   </>
// );

// const MapView = ({ posts }) => <Map items={posts} />;

// function ListPage() {
//   const { postResponse } = useLoaderData();

//   return (
//     <div className="listPage">
//       <div className="listContainer">
//         <div className="wrapper">
//           <Filter />
//           <Suspense fallback={<p>Loading posts...</p>}>
//             <Await
//               resolve={postResponse}
//               errorElement={<p>Error loading posts. Please try again later.</p>}
//             >
//               {(resolvedPosts) => <PostList posts={resolvedPosts.data} />}
//             </Await>
//           </Suspense>
//         </div>
//       </div>
//       <div className="mapContainer">
//         <Suspense fallback={<p>Loading map...</p>}>
//           <Await
//             resolve={postResponse}
//             errorElement={<p>Error loading map. Please try again later.</p>}
//           >
//             {(resolvedPosts) => <MapView posts={resolvedPosts.data} />}
//           </Await>
//         </Suspense>
//       </div>
//     </div>
//   );
// }

// export default ListPage;
