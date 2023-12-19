import { forwardRef } from "react";
import {
  default as ReactDropzone,
  type DropzoneProps as ReactDropzoneProps,
  type DropzoneState as ReactDropzoneState,
  type DropzoneRef as ReactDropzoneRef,
} from "react-dropzone";

import { type TypedOmit } from "@/utils/types";
import { values } from "@/utils/object";

type DropzoneProps = TypedOmit<ReactDropzoneProps, "children"> & {
  className?: string;
  children: (
    state: TypedOmit<ReactDropzoneState, "getInputProps" | "getRootProps"> & {
      acceptedTypes: string[] | undefined;
    },
  ) => React.ReactNode;
};
const Dropzone = forwardRef<ReactDropzoneRef, DropzoneProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ReactDropzone {...props} ref={ref}>
        {({ getRootProps, getInputProps, ...rest }) => (
          <div className={className} {...getRootProps()}>
            <input {...getInputProps()} />
            {children({
              ...rest,
              acceptedTypes: props.accept
                ? values(props.accept).flat()
                : undefined,
            })}
          </div>
        )}
      </ReactDropzone>
    );
  },
);
Dropzone.displayName = "Dropzone";

export { Dropzone };
