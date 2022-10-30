import { type NextPage } from "next";
import { useQuery, useQueryClient } from "react-query";
import Loader from "../loader";
import getNewsArticles from "../utils";
import { useRouter } from "next/router";

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

  const { data, isLoading, isError } = useQuery(
    ["newsArticles"],
    getNewsArticles
  );

  isError && router.push("/404");

  return (
    <div className="grid h-full w-full items-center justify-items-center bg-gray-200 p-12">
      <div className="pb-12 text-4xl">Fashion News</div>
      <div className="grid h-full w-full max-w-7xl grid-cols-5 justify-items-center gap-4">
        {isLoading ? (
          <Loader />
        ) : (
          data &&
          data.fashionunitedNlNewsArticles.map(
            (a: InewsArticle, index: number) => (
              <div
                className={`h-88 w-full rounded bg-white font-semibold shadow ${
                  index == 0 || index % 10 == 0
                    ? "h-8xl col-span-2 row-span-2 text-2xl"
                    : "text-base"
                }`}
                key={index}
              >
                <div className="rows-[4fr_3fr_1fr] grid h-full w-full">
                  <div className="h-3/5">
                    <img
                      src={a.imageUrl || DEFAULT_IMAGE}
                      className="rounded-t object-cover"
                    />
                  </div>
                  <h2 className="px-3 pt-3">{a.title}</h2>
                  <div className="p-3 text-base font-normal opacity-60">
                    {(index == 0 || index % 10 == 0) && a.description}
                  </div>
                  <div className="self-end px-3 py-4">
                    <a href={a.url} className="text-base underline ">
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default Home;
