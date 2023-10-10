import { Message } from "ai";
import Weather from "@/components/weather";
import Country from "@/components/country";
import ReactMarkdown from "react-markdown";
import { MeOutlinedIcon } from "@xpadev-net/designsystem-icons";
import { SiOpenai } from "react-icons/si";
import clsx from "clsx";

export default function MessageItem({ m, data }: { m: Message; data: any }) {
  return (
    <div className="mb-5">
      <div className="flex items-start">
        <div
          className={clsx(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
            m.role === "user" ? "bg-gray-100" : "bg-black"
          )}
        >
          {m.role === "user" ? (
            <MeOutlinedIcon
              width="1em"
              height="1em"
              fill="currentColor"
              className="h-4 w-4"
            />
          ) : (
            <SiOpenai className="h-4 w-4 text-white" />
          )}
        </div>
        <ReactMarkdown className="prose prose-neutral prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow ml-4 max-w-none flex-1 space-y-2 overflow-hidden px-1">
          {m.content}
        </ReactMarkdown>
      </div>
      <div className="mt-5">
        {data?.type === "get_current_weather" ? (
          <Weather weather={data.sources} />
        ) : (
          data?.type === "get_country_info" && (
            <Country country={data.sources} />
          )
        )}
      </div>
    </div>
  );
}
