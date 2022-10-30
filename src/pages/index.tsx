import { type NextPage } from "next";
import { useQuery, useQueryClient } from "react-query";
import Loader from "../components/loader";
import getNewsArticles from "../utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface InewsArticle {
  title: string;
  url: string;
  imageUrl: string;
  description: string;
}

const DEFAULT_IMAGE =
  "https://fashionunited.info/global-assets/img/default/fu-default_1200x630_black-favicon.jpg";

const Home: NextPage = () => {
  const router = useRouter();

  const [newsArticles, setNewsArticles] = useState<Array<InewsArticle>>([]);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isError } = useQuery(
    ["newsArticles"],
    getNewsArticles
  );

  isError && router.push("/404");

  useEffect(() => {
    data && setNewsArticles(data.fashionunitedNlNewsArticles);
  }, [data]);

  const loadMore = async () => {
    setOffset((prevOffset) => (prevOffset += 26));
    const newBatch = await getNewsArticles({}, offset + 26);
    setNewsArticles((prevArticles) => [
      ...prevArticles,
      ...newBatch.fashionunitedNlNewsArticles,
    ]);
  };

  return (
    <div className="grid h-full w-full items-center justify-items-center bg-gray-200 p-12">
      <div className="pb-12 text-4xl">Fashion News</div>
      <div className="grid h-full w-full max-w-7xl grid-cols-5 justify-items-center gap-4">
        {isLoading ? (
          <Loader />
        ) : (
          data &&
          newsArticles.map((a: InewsArticle, index: number) => (
            <div
              className={`h-88 w-full rounded bg-white font-semibold shadow ${
                index == 0 || index % 13 == 0
                  ? "h-8xl col-span-2 row-span-2 text-3xl"
                  : index % 10 == 0
                  ? "col-span-2 text-lg"
                  : "text-base"
              }`}
              key={index}
            >
              <div className="rows-[4fr_3fr_1fr] grid h-full w-full">
                <div
                  className={`${
                    index == 1 || index % 13 == 0
                      ? "h-88"
                      : index % 10 == 0
                      ? "h-56"
                      : "h-40"
                  }`}
                >
                  <img
                    src={a.imageUrl || DEFAULT_IMAGE}
                    className="h-full w-full rounded-t object-cover"
                  />
                </div>
                <h2 className="px-3 pt-3">{a.title}</h2>
                <div className="p-3 text-base font-normal opacity-60">
                  {(index == 0 || index % 13 == 0) && a.description}
                </div>
                <div className="self-end px-3 py-4">
                  <a href={a.url} className="text-base underline ">
                    Read more
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-16 grid justify-items-center">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={loadMore}
        >
          Load more
        </button>
      </div>
    </div>
  );
};

export default Home;
