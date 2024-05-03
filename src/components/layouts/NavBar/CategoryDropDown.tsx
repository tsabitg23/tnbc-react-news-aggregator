import { capitalizeFirstLetter } from "@/lib/common/utils";
import { MegaMenu } from "flowbite-react";
import React from "react";

export interface DropDownOption {
    title: string,
    icon: React.ReactNode
    target: string
}

interface CategoryDropDownProps {
    title: string,
    dropdowns: DropDownOption[]
}

export default function CategoryDropDown(props: CategoryDropDownProps){
    return (
        <div className="hidden md:flex">
            <MegaMenu>
                <MegaMenu.Dropdown toggle={<>{props.title}</>}>
                    <ul className="grid grid-cols-3">
                    <div className="space-y-4 p-4">
                        {
                            props.dropdowns.map((dropdown, index) => (
                                <li key={index}>
                                    <a href={dropdown.target} className="hover:text-primary dark:hover:text-primary-500 flex items-center">
                                        {dropdown.icon}
                                        {capitalizeFirstLetter(dropdown.title)}
                                    </a>
                                </li>
                            ))
                        }
                    </div>
                    </ul>
                </MegaMenu.Dropdown>
            </MegaMenu>
        </div>
    )
}