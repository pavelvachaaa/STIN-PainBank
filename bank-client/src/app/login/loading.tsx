"use client"
import { Spinner } from "flowbite-react";

export default function Loading() {
    return (
        <div className="text-center grid h-screen place-items-center">
            <Spinner aria-label="Center-aligned spinner example" size="xl" />
        </div>
    )
}