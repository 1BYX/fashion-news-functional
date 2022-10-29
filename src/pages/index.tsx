import { type NextPage } from "next";
import { useQuery, useQueryClient } from "react-query";
import Loader from "../loader";
import getNewsArticles from "../utils";

interface InewsArticle {
  title: string;
  url: string;
  imageUrl: string;
  description: string;
}

const Home: NextPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(
    ["newsArticles"],
    getNewsArticles
  );

  data && console.log(data);

  return (
    <div className="grid h-screen w-full items-center justify-items-center bg-gray-200">
      {isLoading ? (
        <Loader />
      ) : (
        data &&
        data.fashionunitedNlNewsArticles.map(
          (a: InewsArticle, index: number) => (
            <div className="mb-4 h-48 w-48 rounded bg-white shadow" key={index}>
              {a.title}
            </div>
          )
        )
      )}
    </div>
  );
};

export default Home;
