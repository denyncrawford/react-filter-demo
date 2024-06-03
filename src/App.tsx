/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import { useFilter } from "@denyncrawford/react-filters";
import { Controller } from "@denyncrawford/react-filters/controller";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { Code, Github } from "lucide-react";
import { prettyPrintJson } from "pretty-print-json";
import { TooltipComposed } from "./components/composed/tooltip.composed";
import { cn } from "./lib/utils";

function App() {
  const [arrayFilter, setArrayFilter] = useState<
    {
      name: string;
      added: boolean;
    }[]
  >([
    {
      name: "Monthly Subscription",
      added: false,
    },
    {
      name: "Yearly Subscription",
      added: false,
    },
    {
      name: "Purchase",
      added: false,
    },
  ]);
  const [_destValues, setDestValues] = useState<string[]>([]);
  const {
    register,
    deSerializedValues,
    serializedValues,
    control,
    // watch,
    searchString,
  } = useFilter({});

  useEffect(() => {
    window.location.hash = `#${searchString}`;
  }, [searchString]);

  // Simulates a multi-select filter input
  const registerArrayFilter = register({
    name: "paymentType",
    displayName: "Payment Type",
    type: "multiple",
  });

  return (
    <div className="min-h-screen v-stack my-40">
      <h1 className="text-5xl font-bold">React Filters</h1>
      <div className="h-stack">
        <TooltipComposed message="Github repo">
          <a
            href="https://github.com/denyncrawford/react-filter"
            target="_blank"
          >
            <Github size={20} />
          </a>
        </TooltipComposed>
        <TooltipComposed message="Demo code">
          <a
            href="https://github.com/denyncrawford/react-filter-demo"
            target="_blank"
          >
            <Code size={20} />
          </a>
        </TooltipComposed>
        <TooltipComposed message="JSR package">
          <a href="https://jsr.io/@denyncrawford/react-filters" target="_blank">
            <img src="https://jsr.io/badges/@denyncrawford/react-filters" />
          </a>
        </TooltipComposed>
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
                  id="terms"
                  value={value}
                  onCheckedChange={(value) => {
                    onChange(!!value);
                  }}
                />
              )}
            />
            <Label htmlFor="terms" className="whitespace-nowrap">
              Accept terms
            </Label>
          </div>
        </div>
        <div className="h-stack">
          <h2>Filter by:</h2>
          {arrayFilter.map((f) => (
            <Button
              size={"sm"}
              className={cn("dark:bg-neutral-800 dark:text-white", {
                "dark:bg-neutral-800 !text-neutral-600": f.added,
              })}
              key={f.name}
              onClick={() => {
                // this should be a component that already auto updates it's own state
                // but this is a demonstration of how to do it manually
                // the idea is only to execute the onChange function of the filter
                setArrayFilter((curr) => {
                  return curr.map((f2) => {
                    if (f.name === f2.name && !f2.added) {
                      setDestValues((curr2) => {
                        registerArrayFilter.onChange?.({
                          target: {
                            // @ts-expect-error - this is a bug in react-filters
                            value: [...curr2, f.name],
                          },
                        });
                        return [...curr2, f.name];
                      });
                      return {
                        ...f2,
                        added: true,
                      };
                    } else if (f.name === f2.name && f2.added) {
                      setDestValues((curr2) => {
                        registerArrayFilter.onChange?.({
                          target: {
                            // @ts-expect-error - this is a bug in react-filters
                            value:
                              curr2.length === 1
                                ? undefined
                                : curr2.filter((v) => v !== f.name),
                          },
                        });
                        return curr2.filter((v) => v !== f.name);
                      });
                      return {
                        ...f2,
                        added: false,
                      };
                    }
                    return f2;
                  });
                });
              }}
            >
              {f.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-stack !gap-6 !gap-y-4 flex-wrap max-w-[700px] justify-center">
        <h1>Applyed filters:</h1>
        <div className="h-stack !gap-2 max-w-[700px] flex-wrap justify-center">
          {serializedValues.map((f) => (
            <div
              key={f.key}
              className="h-stack !gap-1 rounded-lg bg-neutral-950 px-4 py-2 text-xs whitespace-nowrap"
            >
              <span className="font-bold">{f.label}</span>:{" "}
              <span className="text-neutral-500 whitespace-break-spaces">
                {f.value as string}
              </span>
            </div>
          ))}
          {serializedValues.length === 0 && (
            <div className="text-neutral-500">No filters applied</div>
          )}
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
