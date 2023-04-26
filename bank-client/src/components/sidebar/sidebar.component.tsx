"use client"
import { Sidebar } from "flowbite-react";

export default function SidebarMenu() {
    return (
        <div className=" w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
            <Sidebar aria-label="Default sidebar example"  collapseBehavior="hide" collapsed={true} >
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item
                            href="#"
                        >
                            Dashboard
                        </Sidebar.Item>
                        <Sidebar.Item
                            href="#"
                            label="Pro"
                            labelColor="alternative"
                        >
                            Kanban
                        </Sidebar.Item>
                        <Sidebar.Item
                            href="#"
                            label="3"
                        >
                            Inbox
                        </Sidebar.Item>
                        <Sidebar.Item
                            href="#"
                        >
                            Users
                        </Sidebar.Item>
                        <Sidebar.Item
                            href="#"
                        >
                            Products
                        </Sidebar.Item>
                        <Sidebar.Item
                            href="#"
                        >
                            Sign In
                        </Sidebar.Item>
                        <Sidebar.Item
                            href="#"
                        >
                            Sign Up
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    )
}