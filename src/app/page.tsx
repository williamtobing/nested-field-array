"use client";

import * as React from "react";
import {
  useForm,
  useFieldArray,
  Control,
  // UseFieldArrayReturn,
  useWatch,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";

type Job = {
  firstName: string;
  lastName: string;
};

type JobData = {
  array: {
    name: string;
    nestedArray: Job[];
  }[];
};

const defaultValues: JobData = {
  array: [
    {
      name: "Job 1",
      nestedArray: [{ firstName: "firstName 1", lastName: "lastName 1" }],
    },
  ],
};

const NestedForm = ({
  index,
  control,
}: // childFieldArray,
{
  index: number;
  control: Control<JobData>;
  // childFieldArray: UseFieldArrayReturn<JobData, `array.0.nestedArray`>;
  // childFieldArray: UseFieldArrayReturn<JobData, `array.${number}.nestedArray`>;
}) => {
  const childFieldArray = useFieldArray({
    control,
    name: `array.${index}.nestedArray`,
  });

  return (
    <div className="border-2 p-2 space-y-2">
      <Button
        type="button"
        onClick={() =>
          childFieldArray.append({
            firstName: "",
            lastName: "",
          })
        }
      >
        Add child form
      </Button>

      {childFieldArray.fields.map((item, childIndex) => {
        return (
          <React.Fragment key={item.id}>
            <div className="flex items-end gap-2">
              <FormField
                control={control}
                name={`array.${index}.nestedArray.${childIndex}.firstName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="child first name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`array.${index}.nestedArray.${childIndex}.lastName`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="child last name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant={"destructive"}
                onClick={() => childFieldArray.remove(childIndex)}
              >
                <XIcon />
              </Button>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default function App() {
  const [jobData, setJobData] = React.useState(defaultValues);

  const parentForm = useForm<JobData>({
    defaultValues,
  });

  const parentFieldArray = useFieldArray({
    control: parentForm.control,
    name: "array",
  });

  const onSubmit = (data: JobData) => setJobData(data);

  const watchForm = useWatch({ control: parentForm.control, name: "array" });

  return (
    <main className="min-h-[100dvh] p-8 flex w-full">
      <div className="space-y-3 w-1/2 bg-stone-100 p-4">
        <h1 className="font-bold text-xl">Form</h1>

        <Button
          type="button"
          onClick={() =>
            parentFieldArray.append({
              name: "",
              nestedArray: [
                {
                  firstName: "",
                  lastName: "",
                },
              ],
            })
          }
        >
          Add Parent
        </Button>

        <Form {...parentForm}>
          <form
            onSubmit={parentForm.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {parentFieldArray.fields.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <div className="border p-2 space-y-2">
                    <div className="flex items-end gap-2">
                      <FormField
                        control={parentForm.control}
                        name={`array.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Name</FormLabel>
                            <FormControl>
                              <Input placeholder="parent job name" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={"destructive"}
                          onClick={() => parentFieldArray.remove(index)}
                        >
                          <XIcon />
                        </Button>

                        {/* <Button
                          type="button"
                          // TODO: how to add append childFieldArray from here?
                          onClick={() => alert(index)}
                        >
                          Add child form
                        </Button> */}
                      </div>
                    </div>

                    <NestedForm index={index} control={parentForm.control} />
                  </div>
                </React.Fragment>
              );
            })}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>

      <div className="w-1/2 flex">
        <div className="w-1/2 bg-stone-200 p-4 space-y-2">
          <p className="font-semibold">watch data</p>
          <pre>{JSON.stringify(watchForm, null, 2)}</pre>
        </div>

        <div className="w-1/2 bg-stone-300 p-4 space-y-2">
          <p className="font-semibold">submitted data</p>
          <pre>{JSON.stringify(jobData, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
