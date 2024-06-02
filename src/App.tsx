import { useEffect, useState } from "react";
import "./App.css";
import { useFilter } from "@denyncrawford/react-filters";
import { Controller } from "@denyncrawford/react-filters/controller";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { Github } from "lucide-react";
import { prettyPrintJson } from "pretty-print-json";

function App() {
  const [arrayFilter] = useState<string[]>([
    "Yearly Subscription",
    "Monthly Subscription",
    "Purchase",
  ]);
  const [destValues, setDestValues] = useState<string[]>([]);
  const {
    register,
    deSerializedValues,
    serializedValues,
    control,
    // watch,
    searchString,
  } = useFilter({});

  useEffect(() => {
    //   window.location.search = searchString
    // don't sert search but replace without navigating
    window.location.hash = `#${searchString}`;
  }, [searchString]);

  const registerArrayFilter = register({
    name: "paymentType",
    displayName: "Payment Type",
    type: "multiple",
  });

  return (
    <div className="min-h-screen v-stack my-40">
      <h1 className="text-5xl font-bold">React Filters</h1>
      <div className="h-stack">
        <a href="https://github.com/denyncrawford/react-filter" target="_blank">
          <Github size={20} />
        </a>
        <a href="https://jsr.io/@denyncrawford/react-filters" target="_blank">
          <img src="https://jsr.io/badges/@denyncrawford/react-filters" />
        </a>
      </div>
      <h2 className="text-xs text-neutral-500">
        By{" "}
        <a
          href="https://crawford.ml"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          denyncrawford
        </a>
      </h2>
      <div className="v-stack">
        <div className="h-stack">
          <Input
            className="min-w-[300px]"
            type="text"
            placeholder="Search string"
            {...register({
              name: "search",
              displayName: "Search string",
            })}
          />
          <div className="h-stack !gap-4">
            <Controller
              name="terms"
              displayName="Terms"
              type="boolean"
              control={control}
              render={({ onChange, value }) => (
                <Checkbox
                  value={value}
                  onCheckedChange={(value) => {
                    onChange(!!value);
                  }}
                />
              )}
            />
            <Label className=" whitespace-nowrap">Accept terms</Label>
          </div>
        </div>
        <div className="h-stack">
          <h2>Filter by:</h2>
          {arrayFilter.map((f) => (
            <Button
              size={"sm"}
              className="dark:bg-neutral-800 dark:text-white"
              key={f}
              onClick={() => {
                setDestValues((curr) => {
                  registerArrayFilter.onChange?.({
                    target: {
                      // @ts-expect-error - this is a bug in react-filters
                      value: [...destValues, f],
                    },
                  });
                  return [...curr, f];
                });
              }}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-stack !gap-6 !gap-y-4 flex-wrap max-w-[700px] justify-center">
        <h1>Applyed filters:</h1>
        <div
          className="h-stack !gap-2 max-w-[700px] flex-wrap justify-center"
        >
          {serializedValues.map((f) => (
            <div
              key={f.key}
              className="h-stack !gap-1 rounded-lg bg-neutral-950 px-4 py-2 text-xs whitespace-nowrap"
            >
              <span className="font-bold">{f.label}</span>:{" "}
              <span className="text-neutral-500 whitespace-break-spaces">{f.value as string}</span>
            </div>
          ))}
          { serializedValues.length === 0 && <div className="text-neutral-500">No filters applied</div> }
        </div>
      </div>
      <div style={{ display: "flex", gap: "30px" }}>
        <div className="v-stack">
          <h3 className="text-xl font-bold">De-serialized values</h3>
          <code className="dark:bg-neutral-950 p-6 rounded-lg dark:text-white min-w-[300px] min-h-[150px]">
            <pre
              className="max-w-[350px] whitespace-pre-wrap overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html: prettyPrintJson.toHtml(deSerializedValues),
              }}
            />
          </code>
        </div>
        <div className="v-stack">
          <h3 className="text-xl font-bold">Serialized values</h3>
          <code className="dark:bg-neutral-950 p-6 rounded-lg dark:text-white min-w-[300px] min-h-[150px]">
            <pre
              className="max-w-[350px] whitespace-pre-wrap overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html: prettyPrintJson.toHtml(serializedValues),
              }}
            />
          </code>
        </div>
      </div>
    </div>
  );
}

export default App;
