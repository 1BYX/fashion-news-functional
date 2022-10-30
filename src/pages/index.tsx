import { type NextPage } from "next";
import { useQuery } from "react-query";
import Loader from "../components/loader";
import getNewsArticles from "../utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";

//type for the article object
interface InewsArticle {
  title: string;
  url: string;
  imageUrl: string;
  description: string;
}

const DEFAULT_IMAGE =
  "https://fashionunited.info/global-assets/img/default/fu-default_1200x630_black-favicon.jpg";

const Home: NextPage = () => {
  //router initialization and query retreival, for the sharing functionality
  const router = useRouter();
  const { query } = router;

  //article array and offset state
  const [newsArticles, setNewsArticles] = useState<Array<InewsArticle>>([]);
  const [offset, setOffset] = useState(0);

  //initial batch fetch via react query
  const { data, isLoading, isError } = useQuery(
    ["newsArticles"],
    getNewsArticles
  );

  //redirect in case fetch fails
  isError && router.push("/404");

  //effect for making sure we show the dialog with the linked news article in case there's a query parameter right away
  useEffect(() => {
    data && setNewsArticles(data.fashionunitedNlNewsArticles);

    const fetchLinkedNew = async () => {
      const res = await getNewsArticles({}, Number(query.id), 1);
      console.log(res);
      setNewsArticles((prevNewsArticles) => [
        ...prevNewsArticles,
        ...res.fashionunitedNlNewsArticles,
      ]);
    };

    if (query.id) {
      fetchLinkedNew();
    }
  }, [data]);

  //loadMore function that is run when the button is clicked
  const loadMore = async () => {
    setOffset((prevOffset) => (prevOffset += 15));

    //fetching step
    const newBatch = await getNewsArticles({}, offset + 15);

    //state setting step
    setNewsArticles((prevArticles) => [
      ...prevArticles,
      ...newBatch.fashionunitedNlNewsArticles,
    ]);
  };

  //function for showing and hiding a dialog, the state of it is tied to the query string in url
  const toggleDialog = (isOpen: boolean, _id?: number, _title?: string) => {
    if (isOpen && _id != undefined && _title) {
      router.push(
        {
          query: { id: _id, title: _title },
        },
        undefined,
        { shallow: true }
      );
    } else {
      if (newsArticles.length % 15 != 0) {
        const formattedArticles = newsArticles.slice(
          0,
          newsArticles.length - 1
        );
        setNewsArticles(formattedArticles);
      }
      router.push(
        {
          query: {},
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <div className="grid h-full w-full items-center justify-items-center bg-gray-200 p-6 sm:p-12">
      <div className="pb-12 text-4xl">Fashion News</div>

      <div className="grid h-full w-full max-w-7xl grid-flow-row-dense grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading ? (
          <Loader />
        ) : (
          data &&
          newsArticles.map((a: InewsArticle, index: number) => (
            <>
              <div
                onClick={() => toggleDialog(true, index, a.title)}
                className={`h-88 w-full rounded bg-white font-semibold shadow ${
                  index == 0 || index % 10 == 0
                    ? "sm:h-8xl sm:col-span-2 sm:row-span-2 sm:text-3xl"
                    : index % 10 == 0
                    ? "sm:col-span-2 sm:text-lg"
                    : "text-base"
                }`}
                key={index}
              >
                <div className="rows-[4fr_3fr_1fr] grid h-full w-full">
                  <div
                    className={`${
                      index == 1 || index % 10 == 0
                        ? "sm:h-88"
                        : index % 10 == 0
                        ? "sm:h-56"
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
                    {(index == 0 || index % 10 == 0) && a.description}
                  </div>
                  <div className="self-end px-3 py-4">
                    <a href={a.url} className="text-base underline ">
                      Read more
                    </a>
                  </div>
                </div>
              </div>

              <Dialog
                open={query.title == a.title}
                onClose={() => toggleDialog(false)}
              >
                <div className="h-88 h-8xl col-span-2 row-span-2 w-full rounded bg-white text-3xl font-semibold shadow">
                  <div className="rows-[4fr_3fr_1fr] grid h-full w-full">
                    <div className="h-88">
                      <img
                        src={a.imageUrl || DEFAULT_IMAGE}
                        className="h-full w-full rounded-t object-cover"
                      />
                    </div>
                    <h2 className="px-3 pt-3">{a.title}</h2>
                    <div className="p-3 text-base font-normal opacity-60">
                      {a.description}
                    </div>
                    <div className="self-end px-3 py-4">
                      <a href={a.url} className="text-base underline ">
                        Read more
                      </a>
                    </div>
                  </div>
                </div>
              </Dialog>
            </>
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
