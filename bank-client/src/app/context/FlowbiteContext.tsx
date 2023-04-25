"use client";

import { Flowbite } from "flowbite-react";
import { FC, PropsWithChildren } from "react";

const FlowbiteContext: FC<PropsWithChildren> = function ({ children }) {
    return <Flowbite>{children}</Flowbite>;
};

export default FlowbiteContext;