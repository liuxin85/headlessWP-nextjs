import Image from "next/image";

//to test open url: http://localhost:3000/posts/cozmo-robot
export default function Post(props) {
  const post = props.post;
  return (
    <div>
      <h1>{post.title}</h1>
      <Image width="640" height="426" src={post.featuredImage.node.sourceUrl} />
      <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
    </div>
  );
}

export async function getStaticProps(context) {
  const res = await fetch("https://yutiger.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query SinglePost($id: ID!, $idType: PostIdType!){
            post(id: $id, idType:$idType){
                title
                slug
                content
                featuredImage {
                    node {
                        sourceUrl
                    }
                }
            }
        }
      `,
      variables: {
        id: context.params.slug,
        idType: "SLUG",
      },
    }),
  });

  const json = await res.json();

  return {
    props: {
      post: json.data.post,
    },
  };
}

export async function getStaticPaths() {
  const res = await fetch("https://yutiger.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query AllPostsQuery{
              posts{
                  nodes{
                      slug
                      content
                      title
                      featuredImage{
                          node {
                              sourceUrl
                          }
                      }
                  }
              }
          }
        `,
    }),
  });

  const json = await res.json();
  const posts = json.data.posts.nodes;

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  // So we can get path that next.js can build for us.
  return {
    paths,
    fallback: false,
  };
}
