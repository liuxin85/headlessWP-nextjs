import Link from "next/link";

export default function Home({ posts }) {
  console.log(posts.nodes);

  const showPosts = posts.nodes.map((post) => (
    <ul key={post.slug}>
      <li>
        <Link href={`/posts/${post.slug}`}>
        {post.title}
        </Link>
      </li>
    </ul>
  ));
  return (
    <div>
      <h1>Render Posts titles</h1>
      {showPosts}
    </div>
  );
}

// we want fetch

export async function getStaticProps() {
  const res = await fetch("https://yutiger.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
      query HomePageQuery {
        posts {
          nodes {
            slug
            title
          }
        }
      }
      `,
    }),
  });

  const json = await res.json();

  return {
    props: {
      posts: json.data.posts,
    },
  };
}
